import { useEffect, useRef, useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

interface DeskQRCodeProps {
  deskId: string;
  deskName: string;
  size?: number;
  showDownloadAction?: boolean;
}

const escapeXml = (value: string) => {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;');
};

const sanitizeFileName = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const loadImage = (src: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error('Unable to prepare the QR code for download.'));
    image.src = src;
  });
};

const DeskQRCode = ({ deskId, deskName, size = 200, showDownloadAction = false }: DeskQRCodeProps) => {
  const [checkinUrl, setCheckinUrl] = useState(`/checkin?desk=${deskId}`);
  const [isDownloading, setIsDownloading] = useState(false);
  const qrWrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setCheckinUrl(`${window.location.origin}/checkin?desk=${deskId}`);
  }, [deskId]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      const qrSvg = qrWrapperRef.current?.querySelector('svg');
      if (!(qrSvg instanceof SVGSVGElement)) {
        throw new Error('Unable to prepare the QR code for download.');
      }

      const clonedQrSvg = qrSvg.cloneNode(true) as SVGSVGElement;
      clonedQrSvg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      clonedQrSvg.setAttribute('width', String(size));
      clonedQrSvg.setAttribute('height', String(size));
      clonedQrSvg.setAttribute('x', '48');
      clonedQrSvg.setAttribute('y', '40');
      clonedQrSvg.setAttribute('shape-rendering', 'crispEdges');

      const cardWidth = size + 96;
      const cardHeight = size + 138;
      const downloadMarkup = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${cardWidth}" height="${cardHeight}" viewBox="0 0 ${cardWidth} ${cardHeight}" role="img" aria-labelledby="desk-title desk-subtitle">
  <rect width="${cardWidth}" height="${cardHeight}" rx="28" fill="#ffffff" />
  <rect x="16" y="16" width="${cardWidth - 32}" height="${cardHeight - 32}" rx="24" fill="#ffffff" stroke="#e5e7eb" />
  ${clonedQrSvg.outerHTML}
  <text id="desk-title" x="${cardWidth / 2}" y="${size + 82}" font-family="Arial, sans-serif" font-size="18" font-weight="700" text-anchor="middle" fill="#050505">${escapeXml(deskName)}</text>
  <text id="desk-subtitle" x="${cardWidth / 2}" y="${size + 108}" font-family="Arial, sans-serif" font-size="12" letter-spacing="1.6" text-anchor="middle" fill="#6b7280">Scan to check in or out</text>
  <text x="${cardWidth / 2}" y="${size + 124}" font-family="Arial, sans-serif" font-size="10" text-anchor="middle" fill="#9ca3af">Desk ID: ${escapeXml(deskId)}</text>
</svg>`;

      const svgBlob = new Blob([downloadMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const image = await loadImage(svgUrl);
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const scale = 2;

      if (!context) {
        throw new Error('Unable to prepare the QR code for download.');
      }

      canvas.width = cardWidth * scale;
      canvas.height = cardHeight * scale;
      context.scale(scale, scale);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, cardWidth, cardHeight);
      context.drawImage(image, 0, 0, cardWidth, cardHeight);

      const pngBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
            return;
          }

          reject(new Error('Unable to prepare the QR code for download.'));
        }, 'image/png');
      });

      URL.revokeObjectURL(svgUrl);

      const objectUrl = URL.createObjectURL(pngBlob);
      const anchor = document.createElement('a');
      const fileNamePrefix = [sanitizeFileName(deskName), sanitizeFileName(deskId)]
        .filter(Boolean)
        .join('-');

      anchor.href = objectUrl;
      anchor.download = `${fileNamePrefix || 'desk'}-qr-code.png`;
      document.body.append(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to download the QR code.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_28px_72px_-48px_rgba(0,0,0,0.3)]">
      <div ref={qrWrapperRef} className="rounded-[1.5rem] border border-black/10 bg-white p-4">
        <QRCodeSVG
          value={checkinUrl}
          size={size}
          level="H"
          includeMargin
          fgColor="#050505"
          bgColor="#ffffff"
          className="rounded"
        />
      </div>
      <div className="text-center">
        <p className="text-sm font-semibold text-foreground">{deskName}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">Scan to check in or out</p>
      </div>
      {showDownloadAction ? (
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-black/10 bg-white/80"
          onClick={() => void handleDownload()}
          disabled={isDownloading}
        >
          {isDownloading ? <Loader2 className="animate-spin" /> : <Download />}
          {isDownloading ? 'Preparing download...' : 'Download PNG'}
        </Button>
      ) : null}
    </div>
  );
};

export default DeskQRCode;

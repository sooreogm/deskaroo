import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface DeskQRCodeProps {
  deskId: string;
  deskName: string;
  size?: number;
}

const DeskQRCode = ({ deskId, deskName, size = 200 }: DeskQRCodeProps) => {
  const [checkinUrl, setCheckinUrl] = useState(`/checkin?desk=${deskId}`);

  useEffect(() => {
    setCheckinUrl(`${window.location.origin}/checkin?desk=${deskId}`);
  }, [deskId]);

  return (
    <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-black/10 bg-white p-5 shadow-[0_28px_72px_-48px_rgba(0,0,0,0.3)]">
      <div className="rounded-[1.5rem] border border-black/10 bg-white p-4">
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
    </div>
  );
};

export default DeskQRCode;

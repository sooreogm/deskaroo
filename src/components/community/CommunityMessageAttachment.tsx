import { useEffect, useState } from 'react';
import { Download, FileAudio, FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { fetchCommunityAttachmentBlob } from '@/lib/api';
import { CommunityMessage } from '@/types';

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const CommunityMessageAttachment = ({
  attachment,
}: {
  attachment: CommunityMessage['attachments'][number];
}) => {
  const isVoiceNote =
    attachment.kind === 'voice_note' || attachment.mimeType.startsWith('audio/');
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState(isVoiceNote);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!isVoiceNote) {
      return;
    }

    let isActive = true;
    let objectUrl: string | null = null;

    const loadAudio = async () => {
      try {
        const blob = await fetchCommunityAttachmentBlob(attachment.url);
        objectUrl = URL.createObjectURL(blob);

        if (isActive) {
          setAudioUrl(objectUrl);
        }
      } catch (error) {
        if (isActive) {
          toast.error(error instanceof Error ? error.message : 'Unable to load the voice note.');
        }
      } finally {
        if (isActive) {
          setIsAudioLoading(false);
        }
      }
    };

    void loadAudio();

    return () => {
      isActive = false;

      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [attachment.url, isVoiceNote]);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const blob = await fetchCommunityAttachmentBlob(attachment.url);
      const objectUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = objectUrl;
      anchor.download = attachment.fileName;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Unable to download the attachment.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="rounded-[1.25rem] border border-black/10 bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium text-foreground">
            {isVoiceNote ? <FileAudio className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
            <span className="truncate">{attachment.fileName}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
        </div>

        {!isVoiceNote && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-full"
            onClick={() => void handleDownload()}
            disabled={isDownloading}
          >
            {isDownloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            <span className="sr-only">Download attachment</span>
          </Button>
        )}
      </div>

      {isVoiceNote ? (
        <div className="mt-3">
          {isAudioLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading voice note...
            </div>
          ) : audioUrl ? (
            <audio controls src={audioUrl} className="w-full" preload="metadata" />
          ) : (
            <p className="text-sm text-muted-foreground">Unable to load this voice note.</p>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default CommunityMessageAttachment;

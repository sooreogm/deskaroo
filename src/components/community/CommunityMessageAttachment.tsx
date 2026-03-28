import { useState } from 'react';
import { Download, FileText, Loader2 } from 'lucide-react';
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
  const [isDownloading, setIsDownloading] = useState(false);

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
            <FileText className="h-4 w-4" />
            <span className="truncate">{attachment.fileName}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">{formatFileSize(attachment.size)}</p>
        </div>

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
      </div>
    </div>
  );
};

export default CommunityMessageAttachment;

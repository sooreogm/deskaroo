import { FormEvent, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeft,
  Camera,
  FileAudio,
  FileText,
  Hash,
  Loader2,
  MessageSquare,
  Mic,
  Paperclip,
  Send,
  Square,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'sonner';
import AppLayout from '@/components/layout/AppLayout';
import CommunityMessageAttachment from '@/components/community/CommunityMessageAttachment';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import {
  useCommunitySpace,
  useJoinCommunitySpace,
  usePostCommunityMessage,
} from '@/hooks/useCommunity';
import { cn } from '@/lib/utils';

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment[0]?.toUpperCase() ?? '')
    .join('');
};

const formatMessageTimestamp = (date: Date) => {
  return format(date, 'MMM d, h:mm a');
};

const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_VOICE_NOTE_SIZE_BYTES = 12 * 1024 * 1024;

const formatFileSize = (size: number) => {
  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const formatRecordingTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return `${mins}:${secs}`;
};

const CommunitySpace = () => {
  const router = useRouter();
  const { data: community, isLoading, error, refetch } = useCommunitySpace();
  const joinMutation = useJoinCommunitySpace();
  const postMutation = usePostCommunityMessage();
  const [draft, setDraft] = useState('');
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [voiceNoteFile, setVoiceNoteFile] = useState<File | null>(null);
  const [voiceNotePreviewUrl, setVoiceNotePreviewUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const feedEndRef = useRef<HTMLDivElement | null>(null);
  const attachmentInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const recordingChunksRef = useRef<Blob[]>([]);
  const recordingIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [community?.messages.length]);

  useEffect(() => {
    if (!voiceNoteFile) {
      setVoiceNotePreviewUrl((currentUrl) => {
        if (currentUrl) {
          URL.revokeObjectURL(currentUrl);
        }

        return null;
      });
      return;
    }

    const objectUrl = URL.createObjectURL(voiceNoteFile);
    setVoiceNotePreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [voiceNoteFile]);

  useEffect(() => {
    return () => {
      if (recordingIntervalRef.current !== null) {
        window.clearInterval(recordingIntervalRef.current);
      }

      if (mediaRecorderRef.current?.state && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }

      recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push('/dashboard');
  };

  const stopRecordingTimer = () => {
    if (recordingIntervalRef.current !== null) {
      window.clearInterval(recordingIntervalRef.current);
      recordingIntervalRef.current = null;
    }
  };

  const stopRecordingStream = () => {
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
  };

  const handleAttachmentSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    event.target.value = '';

    if (!file) {
      return;
    }

    if (file.size > MAX_ATTACHMENT_SIZE_BYTES) {
      toast.error('Attachments must be 10MB or smaller.');
      return;
    }

    setAttachmentFile(file);
  };

  const handleStartRecording = async () => {
    if (postMutation.isPending) {
      return;
    }

    if (
      typeof window === 'undefined' ||
      typeof MediaRecorder === 'undefined' ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      toast.error('Voice notes are not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const preferredMimeType = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
      ].find((mimeType) => MediaRecorder.isTypeSupported(mimeType));

      const recorder = preferredMimeType
        ? new MediaRecorder(stream, { mimeType: preferredMimeType })
        : new MediaRecorder(stream);

      recordingStreamRef.current = stream;
      mediaRecorderRef.current = recorder;
      recordingChunksRef.current = [];
      setVoiceNoteFile(null);
      setRecordingSeconds(0);
      setIsRecording(true);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordingChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stopRecordingTimer();
        stopRecordingStream();
        setIsRecording(false);

        const mimeType = recorder.mimeType || 'audio/webm';
        const blob = new Blob(recordingChunksRef.current, { type: mimeType });
        recordingChunksRef.current = [];
        mediaRecorderRef.current = null;

        if (!blob.size) {
          return;
        }

        if (blob.size > MAX_VOICE_NOTE_SIZE_BYTES) {
          toast.error('Voice notes must be 12MB or smaller.');
          return;
        }

        const extension = mimeType.includes('mp4')
          ? 'm4a'
          : mimeType.includes('ogg')
          ? 'ogg'
          : 'webm';

        setVoiceNoteFile(
          new File([blob], `voice-note-${Date.now()}.${extension}`, {
            type: mimeType,
            lastModified: Date.now(),
          })
        );
      };

      recorder.start();
      recordingIntervalRef.current = window.setInterval(() => {
        setRecordingSeconds((current) => current + 1);
      }, 1000);
    } catch (recordingError) {
      stopRecordingTimer();
      stopRecordingStream();
      setIsRecording(false);
      toast.error(
        recordingError instanceof Error
          ? recordingError.message
          : 'Unable to start recording the voice note.'
      );
    }
  };

  const handleStopRecording = () => {
    const recorder = mediaRecorderRef.current;

    if (!recorder || recorder.state === 'inactive') {
      stopRecordingTimer();
      stopRecordingStream();
      setIsRecording(false);
      return;
    }

    recorder.stop();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedDraft = draft.trim();

    if ((!trimmedDraft && !attachmentFile && !voiceNoteFile) || postMutation.isPending || isRecording) {
      return;
    }

    try {
      await postMutation.mutateAsync({
        content: trimmedDraft,
        attachmentFile,
        voiceNoteFile,
      });
      setDraft('');
      setAttachmentFile(null);
      setVoiceNoteFile(null);
      setRecordingSeconds(0);
    } catch {
      // The mutation already surfaces the error to the user.
    }
  };

  if (isLoading) {
    return (
      <AppLayout showFloatingNav={false}>
        <div className="mx-auto mt-20 flex max-w-md items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-foreground" />
        </div>
      </AppLayout>
    );
  }

  if (!community || error) {
    return (
      <AppLayout showFloatingNav={false}>
        <div className="shell-panel mx-auto max-w-3xl p-6 sm:p-8">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleGoBack}
            className="h-11 w-11 rounded-2xl border-black/10 bg-white"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Go back</span>
          </Button>
          <span className="mt-6 inline-flex text-[0.72rem] font-bold uppercase tracking-[0.28em] text-foreground/70">
            Community
          </span>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            We couldn&apos;t load the shared space
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
            {error instanceof Error ? error.message : 'Try reloading the page in a moment.'}
          </p>
          <Button
            onClick={() => void refetch()}
            className="mt-8 rounded-full bg-black px-6 text-white hover:bg-black/90"
          >
            Try again
          </Button>
        </div>
      </AppLayout>
    );
  }

  const canPost = !!community.membership && !community.requiresAvatar;
  const canSend = !!canPost && !isRecording && (!!draft.trim() || !!attachmentFile || !!voiceNoteFile);
  const channelName = community.space.slug || 'community';

  return (
    <AppLayout fullBleed showFloatingNav={false}>
      <div className="h-full bg-background">
        <section className="flex h-full min-h-full flex-col bg-background">
          <header className="border-b border-black/10 bg-white px-5 py-4 sm:px-6">
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleGoBack}
                className="h-11 w-11 rounded-2xl border-black/10 bg-white"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Go back</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">
                  {channelName}
                </h1>
                <p className="mt-1 hidden max-w-2xl text-sm leading-6 text-muted-foreground sm:block">
                  {community.space.description ||
                    'A shared office channel for updates, quick questions, and everyday conversations.'}
                </p>
              </div>
            </div>
          </header>

          {community.requiresAvatar ? (
            <>
              <div className="border-b border-black/10 bg-black px-5 py-3 text-sm text-white sm:px-6">
                Add a profile picture before joining this channel.
              </div>
              <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-black text-white">
                    <Camera className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                    This channel needs a visible profile
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Community messages are tied to profile photos so people can recognize who is speaking in the shared space.
                  </p>
                  <Button asChild className="mt-6 rounded-full bg-black px-6 text-white hover:bg-black/90">
                    <Link href="/profile">Upload Profile Picture</Link>
                  </Button>
                </div>
              </div>
            </>
          ) : !community.membership ? (
            <>
              <div className="border-b border-black/10 bg-black px-5 py-3 text-sm text-white sm:px-6">
                You can preview the channel, but you need to join before posting.
              </div>
              <div className="flex flex-1 items-center justify-center px-6 py-12">
                <div className="max-w-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-black text-white">
                    <Hash className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight text-foreground">
                    Join #{channelName}
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Step into the shared office conversation and start posting alongside everyone else.
                  </p>
                  <Button
                    onClick={() => joinMutation.mutate()}
                    disabled={joinMutation.isPending}
                    className="mt-6 rounded-full bg-black px-6 text-white hover:bg-black/90"
                  >
                    {joinMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4" />
                    )}
                    Join Channel
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <ScrollArea className="min-h-0 flex-1 px-4 py-6 sm:px-6 sm:py-8">
                {community.messages.length === 0 ? (
                  <div className="flex h-full min-h-[18rem] flex-col items-center justify-center px-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-[1.25rem] bg-black text-white">
                      <MessageSquare className="h-6 w-6" />
                    </div>
                    <p className="mt-5 text-xl font-semibold tracking-tight text-foreground">
                      No messages yet
                    </p>
                    <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                      Start the channel with the first message and set the tone for the conversation.
                    </p>
                  </div>
                ) : (
                  <div className="mx-auto max-w-3xl space-y-6">
                    {community.messages.map((message) => (
                      <div
                        key={message.id}
                        className={cn(
                          'flex',
                          message.isCurrentUser ? 'justify-end' : 'justify-start'
                        )}
                      >
                        <div
                          className={cn(
                            'max-w-[86%] sm:max-w-[72%]',
                            message.isCurrentUser ? 'items-end' : 'items-start'
                          )}
                        >
                          <div
                            className={cn(
                              'flex items-start gap-3',
                              message.isCurrentUser ? 'justify-end' : 'justify-start'
                            )}
                          >
                            {!message.isCurrentUser && (
                              <Avatar className="mt-1 h-10 w-10 flex-none border border-black/8">
                                <AvatarImage src={message.sender.avatar || ''} alt={message.sender.name} />
                                <AvatarFallback>{getInitials(message.sender.name)}</AvatarFallback>
                              </Avatar>
                            )}

                            <div className={cn('min-w-0', message.isCurrentUser ? 'text-right' : 'text-left')}>
                              {message.content.trim().length > 0 ? (
                                <div
                                  className={cn(
                                    'inline-block rounded-[1.85rem] border px-5 py-4 text-left',
                                    message.isCurrentUser
                                      ? 'rounded-tr-[0.7rem] border-black bg-black text-white'
                                      : 'rounded-tl-[0.7rem] border-black/10 bg-white text-foreground'
                                  )}
                                >
                                  <p className="whitespace-pre-wrap text-[15px] leading-7">
                                    {message.content}
                                  </p>
                                </div>
                              ) : null}

                              {message.attachments.length > 0 ? (
                                <div className="mt-3 space-y-2">
                                  {message.attachments.map((attachment) => (
                                    <CommunityMessageAttachment
                                      key={attachment.id}
                                      attachment={attachment}
                                    />
                                  ))}
                                </div>
                              ) : null}

                              <div
                                className={cn(
                                  'mt-2 flex items-center gap-2 text-xs text-muted-foreground',
                                  message.isCurrentUser ? 'justify-end pr-2' : 'pl-2'
                                )}
                              >
                                {!message.isCurrentUser && (
                                  <span className="font-medium text-foreground/80">
                                    {message.sender.name}
                                  </span>
                                )}
                                <span>{formatMessageTimestamp(message.createdAt)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div ref={feedEndRef} />
                  </div>
                )}
              </ScrollArea>

              <form onSubmit={handleSubmit} className="border-t border-black/10 bg-white px-4 py-4 sm:px-6">
                <div className="mx-auto max-w-3xl">
                  <input
                    ref={attachmentInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleAttachmentSelect}
                  />

                  <div className="rounded-[2rem] border border-black/10 bg-white p-2">
                    {(attachmentFile || voiceNoteFile || isRecording) ? (
                      <div className="space-y-3 px-2 pb-3">
                        {attachmentFile ? (
                          <div className="rounded-[1.25rem] border border-black/10 bg-muted/20 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                  <FileText className="h-4 w-4" />
                                  <span className="truncate">{attachmentFile.name}</span>
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {formatFileSize(attachmentFile.size)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setAttachmentFile(null)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove attachment</span>
                              </Button>
                            </div>
                          </div>
                        ) : null}

                        {isRecording ? (
                          <div className="rounded-[1.25rem] border border-black bg-black p-3 text-white">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 text-sm font-medium">
                                <Mic className="h-4 w-4" />
                                Recording voice note
                              </div>
                              <span className="text-xs uppercase tracking-[0.18em] text-white/70">
                                {formatRecordingTime(recordingSeconds)}
                              </span>
                            </div>
                          </div>
                        ) : voiceNoteFile ? (
                          <div className="rounded-[1.25rem] border border-black/10 bg-muted/20 p-3">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                                  <FileAudio className="h-4 w-4" />
                                  Voice note
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground">
                                  {formatFileSize(voiceNoteFile.size)}
                                </p>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => setVoiceNoteFile(null)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove voice note</span>
                              </Button>
                            </div>

                            {voiceNotePreviewUrl ? (
                              <audio
                                controls
                                src={voiceNotePreviewUrl}
                                className="mt-3 w-full"
                                preload="metadata"
                              />
                            ) : null}
                          </div>
                        ) : null}
                      </div>
                    ) : null}

                    <div className="flex items-end gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white text-muted-foreground hover:bg-muted"
                        onClick={() => attachmentInputRef.current?.click()}
                        disabled={postMutation.isPending || isRecording}
                      >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                      </Button>

                      <div className="flex-1">
                        <Textarea
                          value={draft}
                          onChange={(event) => setDraft(event.target.value)}
                          placeholder="Type your message..."
                          className="min-h-[48px] max-h-32 resize-none border-0 bg-transparent px-1 py-3 text-[15px] leading-6 shadow-none placeholder:text-foreground/45 focus-visible:ring-0 focus-visible:ring-offset-0"
                          maxLength={600}
                        />
                      </div>

                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-12 w-12 rounded-full bg-white text-muted-foreground hover:bg-muted"
                        onClick={() => {
                          if (isRecording) {
                            handleStopRecording();
                          } else {
                            void handleStartRecording();
                          }
                        }}
                        disabled={postMutation.isPending}
                      >
                        {isRecording ? <Square className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                        <span className="sr-only">
                          {isRecording ? 'Stop recording voice note' : 'Record voice note'}
                        </span>
                      </Button>

                      <Button
                        type="submit"
                        disabled={!canSend || postMutation.isPending}
                        className="h-12 w-12 rounded-full border border-black bg-black p-0 text-white hover:bg-black/90"
                      >
                        {postMutation.isPending ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : (
                          <Send className="h-5 w-5 -rotate-12" />
                        )}
                        <span className="sr-only">Send message</span>
                      </Button>
                    </div>
                  </div>

                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </AppLayout>
  );
};

export default CommunitySpace;

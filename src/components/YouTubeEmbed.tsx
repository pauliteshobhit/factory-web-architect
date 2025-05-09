import React from 'react';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/video';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string | null | undefined;
  className?: string;
  title?: string;
}

export function YouTubeEmbed({ url }: { url: string }) {
  if (!isValidYouTubeUrl(url)) {
    return (
      <div className="p-4 border rounded bg-destructive text-destructive-foreground">
        Invalid YouTube URL
      </div>
    );
  }

  const embedUrl = getYouTubeEmbedUrl(url);
  return (
    <div className="w-full aspect-video mt-6">
      <iframe
        src={embedUrl ?? ""}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full rounded-xl shadow-md border"
      />
    </div>
  );
} 
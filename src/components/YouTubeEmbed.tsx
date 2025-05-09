import React from 'react';
import { getYouTubeEmbedUrl, isValidYouTubeUrl } from '@/lib/video';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface YouTubeEmbedProps {
  url: string | null | undefined;
  className?: string;
  title?: string;
}

export function YouTubeEmbed({ url, className = '', title = 'YouTube video player' }: YouTubeEmbedProps) {
  const embedUrl = getYouTubeEmbedUrl(url);

  if (!url) {
    return null;
  }

  if (!isValidYouTubeUrl(url)) {
    return (
      <Alert variant="destructive" className="my-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Invalid YouTube URL format. Please provide a valid YouTube video URL.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className={`aspect-w-16 aspect-h-9 rounded-xl shadow-lg overflow-hidden ${className}`}>
      <iframe
        src={embedUrl || undefined}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
        loading="lazy"
      />
    </div>
  );
} 
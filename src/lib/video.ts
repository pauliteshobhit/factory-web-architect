/**
 * Extracts YouTube video ID from various YouTube URL formats
 * @param url YouTube URL (watch, embed, or youtu.be format)
 * @returns YouTube video ID or null if invalid
 */
export function getYouTubeVideoId(url: string): string | null {
  try {
    const regex = /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w\-]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

/**
 * Generates YouTube embed URL from video ID
 * @param url YouTube URL
 * @returns YouTube embed URL or null if invalid
 */
export function getYouTubeEmbedUrl(videoUrl: string): string | null {
  const id = getYouTubeVideoId(videoUrl);
  return id ? `https://www.youtube.com/embed/${id}` : null;
}

/**
 * Validates if a URL is a valid YouTube video URL
 * @param url URL to validate
 * @returns boolean indicating if URL is valid
 */
export function isValidYouTubeUrl(url: string): boolean {
  return !!getYouTubeVideoId(url);
} 
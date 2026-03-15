import { useEffect, useRef, useCallback } from "react";
import YouTube, { type YouTubeEvent } from "react-youtube";
import { useVideoStore } from "@/store/videoStore";
import { useSidebarStore } from "@/store/sidebarStore";
import { updateProgress } from "@/lib/apiClient";

interface VideoPlayerProps {
  youtubeId: string;
  videoId: string;
  startAt?: number;
}

export function VideoPlayer({ youtubeId, videoId, startAt = 0 }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setTimestamp, markCompleted } = useVideoStore();
  const { updateVideoProgress } = useSidebarStore();

  const saveProgress = useCallback(async () => {
    if (!playerRef.current) return;
    try {
      const currentTime = Math.floor(playerRef.current.getCurrentTime());
      setTimestamp(currentTime);
      updateVideoProgress(videoId, { timestamp: currentTime });
      await updateProgress(videoId, { timestamp: currentTime, completed: false });
    } catch {
      // silent fail
    }
  }, [videoId, setTimestamp, updateVideoProgress]);

  const startProgressInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(saveProgress, 10000);
  }, [saveProgress]);

  const stopProgressInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopProgressInterval();
  }, [stopProgressInterval]);

  const onReady = (event: YouTubeEvent) => {
    playerRef.current = event.target;
    if (startAt > 0) {
      event.target.seekTo(startAt, true);
    }
  };

  const onStateChange = (event: YouTubeEvent) => {
    // 1 = playing, 2 = paused, 0 = ended
    if (event.data === 1) {
      startProgressInterval();
    } else if (event.data === 2) {
      stopProgressInterval();
      saveProgress();
    } else if (event.data === 0) {
      stopProgressInterval();
      markCompleted();
      updateVideoProgress(videoId, { completed: true });
      updateProgress(videoId, { timestamp: 0, completed: true });
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-lg bg-black" style={{ aspectRatio: "16/9" }}>
      <YouTube
        videoId={youtubeId}
        opts={{
          width: "100%",
          height: "100%",
          playerVars: {
            autoplay: 0,
            modestbranding: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
        onStateChange={onStateChange}
        className="absolute inset-0"
        iframeClassName="w-full h-full"
      />
    </div>
  );
}

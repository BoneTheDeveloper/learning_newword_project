"use client";

/**
 * Audio Player Component
 *
 * Phase 2: TTS audio player with play/pause and generation status
 * Integrates with V2.0 TTS Atomic system
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Pause, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ============================================================================
// Types
// ============================================================================

export type AudioProvider = "google" | "azure" | "elevenlabs";

export interface AudioPlayerProps {
  word: string;
  audioUrl?: string | null;
  isGenerating?: boolean;
  isCached?: boolean;
  provider?: AudioProvider;
  durationMs?: number | null;
  onPlay?: () => void;
  onPause?: () => void;
  onRegenerate?: () => void;
  autoplay?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

type PlayerState = "idle" | "loading" | "ready" | "playing" | "paused" | "error";

type PlaybackSpeed = 0.75 | 1 | 1.25 | 1.5;

// ============================================================================
// Provider Colors
// ============================================================================

const PROVIDER_COLORS: Record<AudioProvider, string> = {
  google: "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300",
  azure: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  elevenlabs: "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300",
};

// ============================================================================
// Waveform Visualization Component
// ============================================================================

interface WaveformProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

function Waveform({ isPlaying, barCount = 20, className }: WaveformProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-0.5 h-6",
        "transition-opacity",
        isPlaying ? "opacity-100" : "opacity-30",
        className
      )}
      aria-hidden="true"
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "w-0.5 bg-current rounded-full transition-all duration-150",
            isPlaying && "animate-pulse"
          )}
          style={{
            animationDelay: `${i * 30}ms`,
            height: isPlaying ? `${4 + Math.random() * 12}px` : "8px",
          }}
        />
      ))}
    </div>
  );
}

// ============================================================================
// Main Audio Player Component
// ============================================================================

export function AudioPlayer({
  word,
  audioUrl = null,
  isGenerating = false,
  isCached = false,
  provider = "google",
  durationMs = null,
  onPlay,
  onPause,
  onRegenerate,
  autoplay = false,
  className,
  size = "md",
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [state, setState] = useState<PlayerState>(
    audioUrl ? "ready" : "idle"
  );
  const [speed, setSpeed] = useState<PlaybackSpeed>(1);
  const [_volume, _setVolume] = useState(1);
  const [_progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Size configurations
  const sizeConfig = {
    sm: { button: "h-8 w-8", icon: "w-4 h-4" },
    md: { button: "h-10 w-10", icon: "w-5 h-5" },
    lg: { button: "h-12 w-12", icon: "w-6 h-6" },
  }[size];

  // Format duration
  const formatDuration = (ms: number | null) => {
    if (!ms) return "--:--";
    const seconds = Math.ceil(ms / 1000);
    if (seconds < 60) return `0:${seconds.toString().padStart(2, "0")}`;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Toggle play/pause
  const togglePlayback = useCallback(() => {
    if (!audioRef.current || !audioUrl) return;

    if (state === "playing") {
      audioRef.current.pause();
      setState("paused");
      onPause?.();
    } else {
      audioRef.current.play();
      setState("playing");
      onPlay?.();
    }
  }, [audioUrl, state, onPlay, onPause]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setState("playing");
    const handlePause = () => setState("paused");
    const handleEnded = () => {
      setState("ready");
      setProgress(0);
    };
    const handleError = (e: Event) => {
      console.error("Audio error:", e);
      setError("Failed to play audio");
      setState("error");
    };

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);
    audio.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, []);

  // Handle autoplay
  useEffect(() => {
    if (autoplay && audioUrl && state === "ready" && audioRef.current) {
      audioRef.current.play();
      setState("playing");
    }
  }, [autoplay, audioUrl, state]);

  // Update state when audioUrl changes
  useEffect(() => {
    if (isGenerating) {
      setState("loading");
    } else if (audioUrl) {
      setState(state === "loading" || state === "error" ? "ready" : state);
    } else {
      setState("idle");
    }
    setError(null);
  }, [audioUrl, isGenerating]);

  // Cycle playback speed
  const cycleSpeed = useCallback(() => {
    const speeds: PlaybackSpeed[] = [0.75, 1, 1.25, 1.5];
    const currentIndex = speeds.indexOf(speed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setSpeed(speeds[nextIndex]);
  }, [speed]);

  // Get icon for current state
  const getIcon = () => {
    if (state === "loading" || isGenerating) {
      return <Loader2 className={cn("animate-spin", sizeConfig.icon)} />;
    }
    if (state === "playing") {
      return <Pause className={sizeConfig.icon} />;
    }
    return <Play className={sizeConfig.icon} />;
  };

  // Get button state class
  const getButtonClass = () => {
    const baseClass = cn(
      "rounded-full flex items-center justify-center transition-all",
      "hover:scale-105 active:scale-95",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
      state === "error"
        ? "bg-red-100 hover:bg-red-200 text-red-600 focus-visible:ring-red-400"
        : "bg-indigo-100 hover:bg-indigo-200 text-indigo-600 focus-visible:ring-indigo-400 dark:bg-indigo-500/20 dark:hover:bg-indigo-500/30 dark:text-indigo-300"
    );

    const disabledClass = (!audioUrl && !isGenerating) || state === "loading";
    return cn(baseClass, sizeConfig.button, disabledClass && "opacity-50 cursor-not-allowed");
  };

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <audio
        ref={audioRef}
        src={audioUrl || undefined}
        preload="none"
        style={{ display: "none" }}
      />

      {/* Play/Pause Button */}
      <Button
        variant="ghost"
        size="icon"
        className={getButtonClass()}
        onClick={togglePlayback}
        disabled={!audioUrl && !isGenerating}
        aria-label={
          state === "playing" ? `Pause ${word}` : `Play ${word}`
        }
      >
        {getIcon()}
      </Button>

      {/* Waveform & Info */}
      <div className="flex items-center gap-2">
        {state === "playing" && (
          <Waveform
            isPlaying={state === "playing"}
            className="text-indigo-400 dark:text-indigo-500"
          />
        )}

        {/* Duration */}
        {durationMs && (
          <span className="text-xs text-gray-500 dark:text-gray-400 tabular-nums">
            {formatDuration(durationMs / speed)}
          </span>
        )}

        {/* Speed Control */}
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={cycleSpeed}
          aria-label={`Playback speed: ${speed}x`}
        >
          {speed}x
        </Button>

        {/* Provider Badge */}
        {(isCached || provider !== "google") && (
          <span
            className={cn(
              "text-xs px-2 py-0.5 rounded-full font-medium",
              PROVIDER_COLORS[provider],
              isCached && "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
            )}
            aria-label={`Provider: ${provider}`}
          >
            {isCached ? (
              <span className="flex items-center gap-1">
                <span className="text-emerald-500">Check</span>
                Cached
              </span>
            ) : (
              <span>{provider.charAt(0).toUpperCase() + provider.slice(1)}</span>
            )}
          </span>
        )}
      </div>

      {/* Regenerate Button */}
      {onRegenerate && state === "error" && (
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          onClick={onRegenerate}
          aria-label="Regenerate audio"
        >
          <RotateCcw className="w-3 h-3" />
        </Button>
      )}

      {/* Error Message */}
      {error && (
        <span className="text-xs text-red-600 dark:text-red-400" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

// ============================================================================
// Compact Audio Button (for card lists)
// ============================================================================

export interface AudioPlayButtonProps {
  audioUrl?: string | null;
  isGenerating?: boolean;
  onPlay?: () => void;
  onRegenerate?: () => void;
  size?: "sm" | "md";
}

export function AudioPlayButton({
  audioUrl = null,
  isGenerating = false,
  onPlay,
  onRegenerate: _onRegenerate,
  size = "sm",
}: AudioPlayButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const sizeClass = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
  }[size];

  const iconSize = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
  }[size];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  const handleClick = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
      onPlay?.();
    }
  };

  return (
    <div className="relative">
      <audio ref={audioRef} src={audioUrl || undefined} preload="none" style={{ display: "none" }} />

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "rounded-full",
          sizeClass,
          !audioUrl && !isGenerating && "opacity-50 cursor-not-allowed"
        )}
        onClick={handleClick}
        disabled={!audioUrl && !isGenerating}
        aria-label="Play pronunciation"
      >
        {isGenerating ? (
          <Loader2 className={cn("animate-spin", iconSize)} />
        ) : (
          <Play className={iconSize} />
        )}
      </Button>

      {/* Playing indicator */}
      {isPlaying && (
        <span className="absolute -bottom-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
        </span>
      )}
    </div>
  );
}

"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Gamepad2, SkipBack, SkipForward, Play, Pause } from "lucide-react";
import Image from "next/image";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

function SpotifyIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
    </svg>
  );
}

const BARS = [
  { duration: "1.1s", delay: "0s", height: "45%" },
  { duration: "0.8s", delay: "0.2s", height: "80%" },
  { duration: "1.4s", delay: "0.05s", height: "60%" },
  { duration: "0.9s", delay: "0.35s", height: "100%" },
  { duration: "1.2s", delay: "0.15s", height: "55%" },
  { duration: "0.7s", delay: "0.45s", height: "75%" },
  { duration: "1.0s", delay: "0.25s", height: "40%" },
  { duration: "1.3s", delay: "0.1s", height: "90%" },
  { duration: "0.85s", delay: "0.4s", height: "65%" },
  { duration: "1.15s", delay: "0.3s", height: "50%" },
  { duration: "0.95s", delay: "0.55s", height: "85%" },
  { duration: "1.25s", delay: "0s", height: "70%" },
];

function MusicVisualizer() {
  return (
    <div className={styles.equalizer}>
      {BARS.map((bar, i) => (
        <span
          key={i}
          className={styles.equalizerBar}
          style={
            {
              height: bar.height,
              animationDuration: bar.duration,
              animationDelay: bar.delay,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function GameVisualizer() {
  return (
    <div className={styles.gameVisualizer} aria-hidden="true">
      <div className={styles.gamePitch}>
        <span className={styles.gamePitchGrid} />
        <span className={styles.gamePitchSweep} />
        <span className={styles.gamePitchLine} />
        <span className={styles.gamePitchBall} />
        <span className={`${styles.gamePulse} ${styles.gamePulseOne}`} />
        <span className={`${styles.gamePulse} ${styles.gamePulseTwo}`} />
        <span className={styles.gameGoalLeft} />
        <span className={styles.gameGoalRight} />
      </div>
    </div>
  );
}

function fmt(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const music = {
  title: "DAISIES",
  artist: "Justin Bieber",
  art: "/now-listening.jpeg",
  spotifyUrl: "https://open.spotify.com/search/DAISIES%20Justin%20Bieber",
  audioUrl: "https://sumanbiswas-website.s3.ap-south-1.amazonaws.com/sumanbiswas-now-playing.mp3",
  startAt: 10,
};

const game = {
  title: "FC 25",
  artist: "PS5",
  art: "/game-poster-1.png",
  spotifyUrl: null as string | null,
  previewUrl: null as string | null,
};

export default function NowPlayingCard() {
  const [mode, setMode] = useState<"music" | "game">("music");
  const [hovered, setHovered] = useState(false);
  const [popupStyle, setPopupStyle] = useState<React.CSSProperties>({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const cardRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const isGameMode = mode === "game";
  const nowPlaying = isGameMode ? game : music;

  // Tick progress via rAF for smooth bar
  function tickProgress() {
    const audio = audioRef.current;
    if (!audio) return;
    setCurrentTime(audio.currentTime);
    setDuration(audio.duration || 0);
    rafRef.current = requestAnimationFrame(tickProgress);
  }

  // Start audio when popup opens (music mode only)
  useEffect(() => {
    if (!hovered || isGameMode) return;

    const audio = new Audio(music.audioUrl);
    audio.volume = 0.6;
    audioRef.current = audio;

    audio.addEventListener("loadedmetadata", () => {
      audio.currentTime = music.startAt;
      setDuration(audio.duration);
    });
    audio.addEventListener("play", () => {
      setIsPlaying(true);
      rafRef.current = requestAnimationFrame(tickProgress);
    });
    audio.addEventListener("pause", () => {
      setIsPlaying(false);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    });
    audio.addEventListener("ended", () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    audio.play().catch(() => setIsPlaying(false));

    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      setIsPlaying(false);
      setCurrentTime(0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hovered, isGameMode]);

  function togglePlay() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play();
    else audio.pause();
  }

  function openPopup() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPopupStyle({ top: rect.top, left: rect.left, width: rect.width });
    setHovered(true);
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => setHovered(false), 80);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <>
      <Card ref={cardRef} className={styles.nowPlayingCard}>
        <div className={styles.nowPlayingTop}>
          <span className={styles.cardTitle}>
            {isGameMode ? "NOW PLAYING" : "NOW LISTENING"}
          </span>
          <div className={styles.nowPlayingIcons}>
            <button
              type="button"
              className={[
                styles.nowPlayingIconButton,
                mode === "music" ? styles.nowPlayingIconButtonActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={mode === "music"}
              aria-label="Switch to Spotify"
              onClick={() => setMode("music")}
            >
              <SpotifyIcon />
            </button>
            <button
              type="button"
              className={[
                styles.nowPlayingIconButton,
                isGameMode ? styles.nowPlayingIconButtonActive : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-pressed={isGameMode}
              aria-label="Switch to game mode"
              onClick={() => setMode("game")}
            >
              <Gamepad2 size={19} />
            </button>
          </div>
        </div>

        <div
          className={styles.nowPlayingBottom}
          onMouseEnter={openPopup}
          onMouseLeave={scheduleClose}
        >
          <div className={styles.nowPlayingAlbumWrap}>
            <Image
              src={nowPlaying.art}
              alt={nowPlaying.title}
              fill
              className={styles.nowPlayingAlbum}
            />
          </div>
          <div className={styles.nowPlayingMeta}>
            <p className={styles.nowPlayingTitle}>{nowPlaying.title}</p>
            <p className={styles.nowPlayingSub}>{nowPlaying.artist}</p>
          </div>
          {isGameMode ? <GameVisualizer /> : <MusicVisualizer />}
        </div>
      </Card>

      {hovered &&
        createPortal(
          <div
            className={styles.nowPlayingPopup}
            style={popupStyle}
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            {/* Art */}
            <div className={styles.nowPlayingPopupArt}>
              <Image
                src={nowPlaying.art}
                alt={nowPlaying.title}
                fill
                className={styles.nowPlayingAlbum}
              />
              <div className={styles.nowPlayingPopupArtOverlay} />
            </div>

            <div className={styles.nowPlayingPopupBody}>
              <div className={styles.nowPlayingPopupLabelRow}>
                <span className={styles.nowPlayingPopupLabel}>
                  {isGameMode ? "NOW PLAYING" : "NOW LISTENING"}
                </span>
                {!isGameMode && <SpotifyIcon size={14} />}
              </div>

              <p className={styles.nowPlayingPopupTitle}>{nowPlaying.title}</p>
              <p className={styles.nowPlayingPopupSub}>{nowPlaying.artist}</p>

              {!isGameMode ? (
                <>
                  {/* Progress */}
                  <div className={styles.nowPlayingPopupProgressRow}>
                    <div
                      className={styles.nowPlayingPopupProgressHitArea}
                      onClick={(e) => {
                        const audio = audioRef.current;
                        if (!audio || !duration) return;
                        const fraction = e.nativeEvent.offsetX / (e.currentTarget as HTMLDivElement).offsetWidth;
                        audio.currentTime = fraction * duration;
                      }}
                    >
                      <div className={styles.nowPlayingPopupProgressTrack}>
                        <div
                          className={styles.nowPlayingPopupProgressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                    <div className={styles.nowPlayingPopupTimes}>
                      <span>{fmt(currentTime)}</span>
                      <span>{duration > 0 ? fmt(duration) : "0:30"}</span>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className={styles.nowPlayingPopupControls}>
                    <button
                      className={styles.nowPlayingPopupSkip}
                      aria-label="Previous"
                      onClick={() => {
                        if (audioRef.current) audioRef.current.currentTime = 0;
                      }}
                    >
                      <SkipBack size={16} />
                    </button>

                    <button
                      className={styles.nowPlayingPopupPlayBtn}
                      aria-label={isPlaying ? "Pause" : "Play"}
                      onClick={togglePlay}
                    >
                      {isPlaying ? (
                        <Pause size={18} fill="currentColor" />
                      ) : (
                        <Play size={18} fill="currentColor" />
                      )}
                    </button>

                    <button
                      className={styles.nowPlayingPopupSkip}
                      aria-label="Next"
                      onClick={() => {
                        if (audioRef.current) {
                          audioRef.current.currentTime = audioRef.current.duration;
                        }
                      }}
                    >
                      <SkipForward size={16} />
                    </button>
                  </div>

                  <a
                    href={music.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.nowPlayingPopupSpotifyLink}
                  >
                    <SpotifyIcon size={13} />
                    Open in Spotify
                  </a>
                </>
              ) : (
                <div className={styles.nowPlayingPopupGameViz}>
                  <GameVisualizer />
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

"use client";

import { Gamepad2, Glasses } from "lucide-react";
import Image from "next/image";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

function SpotifyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
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

function Equalizer() {
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

const song = {
  title: "DAISIES",
  artist: "Justin Bieber",
  art: "/now-listening.jpeg",
};

export default function NowPlayingCard() {
  return (
    <Card className={styles.nowPlayingCard}>
      <div className={styles.nowPlayingTop}>
        <span className={styles.cardTitle}>NOW LISTENING</span>
        <div className={styles.nowPlayingIcons}>
          <SpotifyIcon />
          <Gamepad2 size={16} />
          <Glasses size={16} />
        </div>
      </div>

      <div className={styles.nowPlayingBottom}>
        <div className={styles.nowPlayingAlbumWrap}>
          <Image
            src={song.art}
            alt={song.title}
            fill
            className={styles.nowPlayingAlbum}
          />
        </div>
        <div className={styles.nowPlayingMeta}>
          <p className={styles.nowPlayingTitle}>{song.title}</p>
          <p className={styles.nowPlayingSub}>{song.artist}</p>
        </div>
        <Equalizer />
      </div>
    </Card>
  );
}

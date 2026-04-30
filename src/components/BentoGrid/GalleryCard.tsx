"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

const photos = [
  { src: "/gallery/gallery-6.jpg", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-7.jpg", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-1.jpg", alt: "Peace Pagoda, Darjeeling, November 2023" },
  { src: "/gallery/gallery-8.jpg", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-2.jpg", alt: "Most beautiful village in India - Kalpa" },
  { src: "/gallery/gallery-3.jpg", alt: "Streets of Sangla" },
  { src: "/gallery/gallery-4.jpg", alt: "Sangla Meadows" },
  { src: "/gallery/gallery-5.jpg", alt: "Tehatta 2019" },
];

export default function GalleryCard() {
  const [current, setCurrent] = useState(0);
  const [next, setNext] = useState<number | null>(null);
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function navigate(dir: 1 | -1) {
    if (fading) return;
    const nextIdx = (current + dir + photos.length) % photos.length;
    setNext(nextIdx);
    setFading(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setCurrent(nextIdx);
      setNext(null);
      setFading(false);
    }, 380);
  }

  return (
    <Card className={styles.galleryCard}>
      {/* Base image (current) */}
      <Image
        src={photos[current].src}
        alt={photos[current].alt}
        fill
        priority={current === 0}
        sizes="(max-width: 768px) 100vw, 400px"
        className={styles.galleryImg}
      />

      {/* Incoming image — fades in on top */}
      {next !== null && (
        <Image
          src={photos[next].src}
          alt={photos[next].alt}
          fill
          sizes="(max-width: 768px) 100vw, 400px"
          className={`${styles.galleryImg} ${styles.galleryImgFading}`}
        />
      )}

      {/* Caption */}
      <div className={styles.galleryCaption}>
        <span>{photos[current].alt}</span>
      </div>

      <button className={`${styles.galleryNav} ${styles.galleryNavLeft}`} onClick={() => navigate(-1)} aria-label="Previous photo">
        <ChevronLeft size={16} />
      </button>
      <button className={`${styles.galleryNav} ${styles.galleryNavRight}`} onClick={() => navigate(1)} aria-label="Next photo">
        <ChevronRight size={16} />
      </button>
    </Card>
  );
}

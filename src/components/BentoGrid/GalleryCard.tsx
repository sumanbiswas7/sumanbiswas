"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

const photos = [
  { src: "/gallery/gallery-6.webp", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-7.webp", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-1.webp", alt: "Peace Pagoda, Darjeeling, November 2023" },
  { src: "/gallery/gallery-8.webp", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-2.webp", alt: "Most beautiful village in India - Kalpa" },
  { src: "/gallery/gallery-3.webp", alt: "Streets of Sangla" },
  { src: "/gallery/gallery-4.webp", alt: "Sangla Meadows" },
  { src: "/gallery/gallery-5.webp", alt: "Tehatta 2019" },
];

export default function GalleryCard() {
  const [current, setCurrent] = useState(0);

  function navigate(dir: 1 | -1) {
    setCurrent((c) => (c + dir + photos.length) % photos.length);
  }

  return (
    <Card className={styles.galleryCard}>
      {photos.map((p, i) => (
        <Image
          key={p.src}
          src={p.src}
          alt={p.alt}
          fill
          priority={i === 0}
          loading={i === 0 ? undefined : "eager"}
          sizes="(max-width: 768px) 100vw, 400px"
          className={`${styles.galleryImg}${i === current ? ` ${styles.galleryImgActive}` : ""}`}
        />
      ))}

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

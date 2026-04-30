"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

const photos = [
  { src: "/gallery/gallery-9.png", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-1.jpg", alt: "Darjeeling, November 2023" },
  { src: "/gallery/gallery-2.jpg", alt: "Most beautiful village in India - Kalpa" },
  { src: "/gallery/gallery-3.jpg", alt: "Streets of Sangla" },
  { src: "/gallery/gallery-4.jpg", alt: "Sangla Medows" },
  { src: "/gallery/gallery-5.jpg", alt: "Tehatta 2019" },
  { src: "/gallery/gallery-7.jpg", alt: "Dareeling Zoo, November 2023" },
  { src: "/gallery/gallery-8.jpg", alt: "Dareeling Zoo, November 2023" },
];

export default function GalleryCard() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <Card className={styles.galleryCard}>
      <Image
        src={photos[index].src}
        alt={photos[index].alt}
        fill
        priority={index === 0}
        className={styles.galleryImg}
      />
      <button
        className={`${styles.galleryNav} ${styles.galleryNavLeft}`}
        onClick={prev}
        aria-label="Previous photo"
      >
        <ChevronLeft size={16} />
      </button>
      <button
        className={`${styles.galleryNav} ${styles.galleryNavRight}`}
        onClick={next}
        aria-label="Next photo"
      >
        <ChevronRight size={16} />
      </button>
    </Card>
  );
}

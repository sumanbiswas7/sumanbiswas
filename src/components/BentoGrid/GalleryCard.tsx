"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

const photos = [
  { src: "/photo-parrot.png", alt: "Parrot at the aviary" },
  { src: "/photo-parrot.png", alt: "Blue macaw up close" },
  { src: "/photo-parrot.png", alt: "Golden hour at the park" },
  { src: "/photo-parrot.png", alt: "Street photography" },
];

export default function GalleryCard() {
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i - 1 + photos.length) % photos.length);
  const next = () => setIndex((i) => (i + 1) % photos.length);

  return (
    <Card className={styles.galleryCard}>
      <Image
        key={index}
        src={photos[index].src}
        alt={photos[index].alt}
        fill
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

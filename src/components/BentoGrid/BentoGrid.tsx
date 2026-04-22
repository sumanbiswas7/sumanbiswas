import { ArrowRight, Download, Pencil } from "lucide-react";
import Image from "next/image";
import Card from "./Card";
import Button from "@/components/ui/Button";
import NoteCard from "./NoteCard";
import styles from "./BentoGrid.module.scss";

export default function BentoGrid() {
  return (
    <div className={styles.grid}>
      <MeCard />
      <MeHeroImgCard />
      <NoteCard />
    </div>
  );
}

function MeCard() {
  return (
    <Card className={styles.meGrid}>
      <div className={styles.meGridTop}>
        <span className={styles.cardTitle}>ME</span>
      </div>

      <h1 className={styles.headline}>
        I build digital <span className={styles.accent}>experiences</span> that
        make an impact.
      </h1>

      <p className={styles.sub}>
        FullStack Developer crafting modern, responsive and scalable web
        applications.
      </p>

      <div className={styles.actions}>
        <Button label="View My Work" icon={ArrowRight} variant="primary" />
        <Button label="Download CV" icon={Download} variant="secondary" />
      </div>
    </Card>
  );
}

function MeHeroImgCard() {
  return (
    <Card className={styles.meHeroImgCard}>
      <button className={styles.meHeroEditBtn} aria-label="Edit photo">
        <Pencil size={14} />
      </button>
      <div className={styles.meHeroImgWrapper}>
        <Image
          src="/me.png"
          alt="Suman Biswas"
          fill
          className={styles.meHeroImg}
        />
      </div>
    </Card>
  );
}

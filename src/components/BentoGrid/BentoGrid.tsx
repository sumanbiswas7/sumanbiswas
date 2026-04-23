import { ArrowRight, Download, Pencil, Gamepad2, Play } from "lucide-react";
import Image from "next/image";
import Card from "./Card";
import Button from "@/components/ui/Button";
import NoteCard from "./NoteCard";
import EliCard from "./EliCard";
import GalleryCard from "./GalleryCard";
import WorkCard from "./WorkCard";
import NowPlayingCard from "./NowPlayingCard";
import QuickLinksCard from "./QuickLinksCard";
import styles from "./BentoGrid.module.scss";

export default function BentoGrid() {
  return (
    <div className={styles.grid}>
      <div className={styles.gridRow}>
        <MeCard />
        <MeHeroImgCard />
        <div className={styles.stackedCards}>
          <NowPlayingCard />
          <QuickLinksCard />
        </div>
        <GalleryCard />
        <NoteCard />
      </div>

      <div className={styles.gridRow}>
        <BioCard />
        <PlayGameCard />
        <WorkCard />
        <EliCard />
      </div>
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

function BioCard() {
  return (
    <Card className={styles.bioCard}>
      <div className={styles.bioLeft}>
        <span className={styles.cardTitle}>BIO</span>
        <p className={`${styles.sub} ${styles.bioDesc}`}>
          I’m a self-taught full-stack developer who loves building cool apps
          and constantly leveling up. Outside coding, I’m into football (Hala
          Madrid ⚽), photography, and exploring new places. a self-taught
          full-stack developer, constantly on the journey of learning and all.
        </p>
      </div>
      <div className={styles.bioParrotWrap}>
        <Image
          src="/photo-parrot.png"
          alt="Parrot"
          fill
          className={styles.bioParrotImg}
        />
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

function PlayGameCard() {
  return (
    <Card className={styles.playGameCard}>
      <div className={styles.playGameLeft}>
        <Gamepad2 size={22} className={styles.playGameIcon} />
        <h3 className={styles.playGameTitle}>Take a Break</h3>
        <p className={styles.playGameSub}>
          Play a quick game and relax! Test your reaction speed and beat your
          high score.
        </p>
        <Button label="Play Game" icon={Play} variant="secondary" />
      </div>
      <div className={styles.playGamePoster}>
        <Image
          src="/game-poster-1.png"
          alt="Reaction Speed Test"
          fill
          className={styles.playGamePosterImg}
        />
      </div>
    </Card>
  );
}

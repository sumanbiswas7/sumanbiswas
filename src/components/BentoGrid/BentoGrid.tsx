"use client";

import { useState, useRef, useCallback } from "react";
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

type CardId =
  | "me"
  | "meHero"
  | "stacked"
  | "gallery"
  | "note"
  | "bio"
  | "playGame"
  | "work"
  | "eli";

type Pos = { row: number; col: number };

const INITIAL_ROWS: CardId[][] = [
  ["me", "meHero", "stacked", "gallery", "note"],
  ["bio", "playGame", "work", "eli"],
];

function reorder(rows: CardId[][], from: Pos, to: Pos): CardId[][] {
  const next = rows.map((r) => [...r]);
  const card = next[from.row][from.col];
  next[from.row].splice(from.col, 1);
  const toCol = from.row === to.row && from.col < to.col ? to.col - 1 : to.col;
  next[to.row].splice(toCol, 0, card);
  return next;
}

function renderCard(id: CardId) {
  switch (id) {
    case "me":
      return <MeCard />;
    case "meHero":
      return <MeHeroImgCard />;
    case "stacked":
      return (
        <div className={styles.stackedCards}>
          <NowPlayingCard />
          <QuickLinksCard />
        </div>
      );
    case "gallery":
      return <GalleryCard />;
    case "note":
      return <NoteCard />;
    case "bio":
      return <BioCard />;
    case "playGame":
      return <PlayGameCard />;
    case "work":
      return <WorkCard />;
    case "eli":
      return <EliCard />;
  }
}

export default function BentoGrid() {
  const [rows, setRows] = useState<CardId[][]>(INITIAL_ROWS);
  const [draggingId, setDraggingId] = useState<CardId | null>(null);
  const [overPos, setOverPos] = useState<Pos | null>(null);

  const dragFrom = useRef<Pos | null>(null);
  const lastOver = useRef<Pos | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, cardId: CardId, row: number, col: number) => {
      dragFrom.current = { row, col };
      setDraggingId(cardId);
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      if (dragFrom.current?.row !== row) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (lastOver.current?.row !== row || lastOver.current?.col !== col) {
        lastOver.current = { row, col };
        setOverPos({ row, col });
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      e.preventDefault();
      const from = dragFrom.current;
      if (!from || from.row !== row || (from.row === row && from.col === col)) {
        dragFrom.current = null;
        setDraggingId(null);
        setOverPos(null);
        lastOver.current = null;
        return;
      }
      setRows((prev) => reorder(prev, from, { row, col }));
      dragFrom.current = null;
      setDraggingId(null);
      setOverPos(null);
      lastOver.current = null;
    },
    [],
  );

  const handleDragEnd = useCallback(() => {
    dragFrom.current = null;
    setDraggingId(null);
    setOverPos(null);
    lastOver.current = null;
  }, []);

  return (
    <div className={styles.grid}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.gridRow}>
          {row.map((cardId, colIdx) => {
            const isDragging = draggingId === cardId;
            const isOver =
              overPos?.row === rowIdx &&
              overPos?.col === colIdx &&
              draggingId !== cardId;
            return (
              <div
                key={cardId}
                draggable
                onDragStart={(e) => handleDragStart(e, cardId, rowIdx, colIdx)}
                onDragOver={(e) => handleDragOver(e, rowIdx, colIdx)}
                onDrop={(e) => handleDrop(e, rowIdx, colIdx)}
                onDragEnd={handleDragEnd}
                className={[
                  styles.draggableCard,
                  isDragging ? styles.dragging : "",
                  isOver ? styles.dragOver : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renderCard(cardId)}
              </div>
            );
          })}
        </div>
      ))}
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
          I&apos;m a self-taught full-stack developer who loves building cool
          apps and constantly leveling up. Outside coding, I&apos;m into
          football (Hala Madrid ⚽), photography, and exploring new places. a
          self-taught full-stack developer, constantly on the journey of
          learning and all.
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
        <div className={styles.gameTarget}>
          <div className={styles.gameRingOuter} />
          <div className={styles.gameRingMid} />
          <div className={styles.gameRingInner} />
          <div className={styles.gameDot} />
        </div>
        <div className={styles.gameCrosshairH} />
        <div className={styles.gameCrosshairV} />
      </div>
    </Card>
  );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Shuffle } from "lucide-react";
import { useBentoGrid } from "@/components/BentoGrid/BentoGridContext";
import { useEli } from "@/context/EliContext";
import { useGame } from "@/context/GameContext";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const { shuffle } = useBentoGrid();
  const { openEli } = useEli();
  const { openGame } = useGame();
  const [spinning, setSpinning] = useState(false);

  function handleShuffle() {
    shuffle();
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Link href="/" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); history.pushState("", "", "/"); }}><Image src="/logo.svg" alt="Suman Biswas logo" width={40} height={40} /></Link>
        <div className={styles.identity}>
          <span className={styles.name}>Suman Biswas</span>
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.links}>
          <a href="#work">work</a>
          <a href="#about">about</a>
          <a href="#contact">contact</a>
        </div>
        <button
          className={styles.shuffleBtn}
          aria-label="Shuffle cards"
          onClick={handleShuffle}
        >
          <Shuffle
            size={16}
            className={spinning ? styles.shuffleIconSpin : ""}
          />
        </button>
        <button
          className={styles.gameBtn}
          aria-label="Open playground"
          onClick={openGame}
        >
          <Gamepad2 size={18} />
        </button>
        <button className={styles.botBtn} aria-label="Chat bot" onClick={openEli}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="14" rx="3" />
            <path d="M8 17v4M16 17v4M8 21h8" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

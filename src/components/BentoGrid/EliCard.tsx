"use client";
import { ArrowRight } from "lucide-react";
import styles from "./BentoGrid.module.scss";
import Card from "./Card";
import Button from "@/components/ui/Button";
import { useEli } from "@/context/EliContext";

export default function EliCard() {
  const { openEli } = useEli();
  return (
    <Card className={styles.eliCard}>
      {/* Background decorative circles */}
      <div className={styles.eliDecorCircles} aria-hidden>
        <div className={styles.eliCircle1} />
        <div className={styles.eliCircle2} />
        <div className={styles.eliCircle3} />
      </div>

      {/* Sparkle dots */}
      <span className={styles.eliSpark1}>✦</span>
      <span className={styles.eliSpark2}>✦</span>
      <span className={styles.eliSpark3}>+</span>
      <span className={styles.eliSpark4}>○</span>

      <div className={styles.eliLeft}>
        <h2 className={styles.eliHeading}>
          Try <span className={styles.eliAccent}>Eli</span>
        </h2>

        <p className={styles.eliDesc}>
          Eli is your AI assistant. Ask anything about my work, projects or
          tech. Get instant answers and helpful suggestions.
        </p>

        <Button label="Try Eli" icon={ArrowRight} variant="primary" onClick={openEli} />
      </div>
    </Card>
  );
}

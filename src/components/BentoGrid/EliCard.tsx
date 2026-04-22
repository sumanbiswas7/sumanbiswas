import { ArrowRight, Sparkles } from "lucide-react";
import styles from "./BentoGrid.module.scss";
import Card from "./Card";
import Button from "@/components/ui/Button";

function EliRobot() {
  return (
    <svg
      viewBox="0 0 200 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={styles.eliRobotSvg}
    >
      {/* Antenna */}
      <line
        x1="100"
        y1="18"
        x2="100"
        y2="42"
        stroke="#aaa"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="100" cy="12" r="8" fill="#9aa59a" />
      {/* Head */}
      <rect x="38" y="42" width="124" height="110" rx="32" fill="#e8e8e8" />
      {/* Ears */}
      <rect x="20" y="78" width="20" height="32" rx="10" fill="#d0d0d0" />
      <rect x="160" y="78" width="20" height="32" rx="10" fill="#d0d0d0" />
      {/* Visor */}
      <rect x="54" y="62" width="92" height="72" rx="18" fill="#111" />
      {/* Eyes */}
      <path
        d="M76 106 Q84 94 92 106"
        stroke="#9aa59a"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M108 106 Q116 94 124 106"
        stroke="#9aa59a"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Neck */}
      <rect x="86" y="152" width="28" height="16" rx="6" fill="#d0d0d0" />
    </svg>
  );
}

export default function EliCard() {
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

        <Button label="Try Eli" icon={ArrowRight} variant="primary" />
      </div>
    </Card>
  );
}

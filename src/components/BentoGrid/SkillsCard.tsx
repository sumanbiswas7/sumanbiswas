import { Compass } from "lucide-react";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

const SKILLS = [
  { label: "Next.js", percent: 80 },
  { label: "TypeScript", percent: 70 },
  { label: "System Design", percent: 60 },
];

function RocketSvg() {
  return (
    <svg viewBox="0 0 80 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.skillsRocket}>
      <circle cx="52" cy="88" r="2" fill="#555" />
      <circle cx="56" cy="94" r="1.5" fill="#444" />
      <circle cx="48" cy="96" r="1" fill="#444" />
      <path d="M40 10 C28 30 24 50 26 68 L40 74 L54 68 C56 50 52 30 40 10Z" fill="#c8a090" />
      <circle cx="40" cy="42" r="7" fill="#1e1e1e" stroke="#e8e8e8" strokeWidth="1.5" />
      <path d="M26 68 L18 80 L30 74Z" fill="#b8a394" />
      <path d="M54 68 L62 80 L50 74Z" fill="#b8a394" />
      <path d="M34 74 Q40 86 46 74" fill="#e8804a" opacity="0.9" />
      <path d="M36 74 Q40 82 44 74" fill="#f4a460" opacity="0.8" />
    </svg>
  );
}

export default function SkillsCard() {
  return (
    <Card className={styles.skillsCard}>
      <div className={styles.skillsHeader}>
        <div className={styles.skillsTitle}>
          <span className={styles.skillsTitleIcon}><Compass size={14} /></span>
          Currently Exploring
        </div>
      </div>

      <ul className={styles.skillsList}>
        {SKILLS.map((skill) => (
          <li key={skill.label} className={styles.skillsItem}>
            <div className={styles.skillsItemTop}>
              <span className={styles.skillsLabel}>{skill.label}</span>
              <span className={styles.skillsPercent}>{skill.percent}%</span>
            </div>
            <div className={styles.skillsTrack}>
              <div className={styles.skillsBar} style={{ width: `${skill.percent}%` }} />
            </div>
          </li>
        ))}
      </ul>

      <div className={styles.skillsRocketWrap} aria-hidden>
        <RocketSvg />
      </div>
    </Card>
  );
}

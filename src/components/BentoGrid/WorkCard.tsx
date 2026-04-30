import Card from "./Card";
import styles from "./BentoGrid.module.scss";

export default function WorkCard() {
  return (
    <Card className={styles.workCard}>
      <div className={styles.workTop}>
        <span className={styles.cardTitle}>CURRENTLY AT</span>
        <span className={styles.workLiveDot} />
      </div>

      <div>
        <p className={styles.workRole}>Full Stack Engineer</p>
        <p className={styles.workCompany}>CloudChef Inc. · Series A $20M</p>
      </div>

      <p className={`${styles.sub} ${styles.workDesc}`}>
        Building the core product suite — recipe studio, kitchen manager, and
        data platform. Leading architecture to deployment of the full JS/TS
        codebase. Remote, Bay Area.
      </p>
    </Card>
  );
}

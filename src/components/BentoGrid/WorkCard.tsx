import { MapPin } from "lucide-react";
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
        <div className={styles.workCompanyRow}>
          <p className={styles.workCompany}>CloudChef Inc. · Series A $20M</p>
          <span className={styles.workLocation}>
            <MapPin size={11} strokeWidth={2} />
            Bay Area, Remote
          </span>
        </div>
      </div>

      <p className={`${styles.sub} ${styles.workDesc}`}>
        Building the full TS product suite: recording studio, kitchen manager, zippy.
        own entire ts lifecycle from architecture to deployment. all systems
        integrated with iot using mqtt/zmq, typescript, react, android, node,
        docker etc.
      </p>
    </Card>
  );
}

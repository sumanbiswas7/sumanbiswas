import { ArrowRight, Download } from "lucide-react";
import Card from "./Card";
import Button from "@/components/ui/Button";
import styles from "./BentoGrid.module.scss";

export default function BentoGrid() {
  return (
    <div className={styles.grid}>
      <MeGrid />
    </div>
  );
}

function MeGrid() {
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

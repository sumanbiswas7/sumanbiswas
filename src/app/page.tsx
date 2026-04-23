import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import BentoGrid from "@/components/BentoGrid/BentoGrid";
import { BentoGridProvider } from "@/components/BentoGrid/BentoGridContext";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <div className={styles.page}>
      <Sidebar />
      <BentoGridProvider>
        <div className={styles.main}>
          <Navbar />
          <BentoGrid />
        </div>
      </BentoGridProvider>
    </div>
  );
}

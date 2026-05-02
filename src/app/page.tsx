import Navbar from "@/components/Navbar/Navbar";
import BentoGrid from "@/components/BentoGrid/BentoGrid";
import { BentoGridProvider } from "@/components/BentoGrid/BentoGridContext";
import { EliProvider } from "@/context/EliContext";
import EliTerminal from "@/components/EliTerminal/EliTerminal";
import ScrollLayout from "@/components/ScrollLayout";
import ProjectsSection from "@/components/ProjectsSection";
import styles from "./page.module.scss";
import { Eye } from "lucide-react";
import { redis } from "@/lib/redis";
import VisitTracker from "@/components/VisitTracker";

export default async function Home() {
  const views = (await redis.get<number>("sumanv4:views")) ?? 0;

  return (
    <EliProvider>
      <EliTerminal />
      <VisitTracker />
      <ScrollLayout>
        <BentoGridProvider>
          <div id="home" className={styles.section1}>
            <Navbar />
            <BentoGrid />
          </div>
        </BentoGridProvider>

        <div id="work">
          <div className={styles.sectionBreak}>
            <span className={styles.sectionBreakLine} />
            <span className={styles.sectionBreakLabel}>what i&apos;ve built &amp; building</span>
            <span className={styles.sectionBreakLine} />
          </div>

          <ProjectsSection />
        </div>

        <div id="contact" className={styles.section3}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Get in touch</span>
            <h2 className={styles.sectionTitle}>Contact</h2>
          </div>
          <div className={styles.contactContent}>
            <p className={styles.contactLead}>
              Open to interesting projects, collaborations, and conversations.
            </p>
            <div className={styles.contactLinks}>
              <a className={styles.contactLink} href="mailto:hello@sumanx.com">
                hello@sumanx.com
              </a>
              <a className={styles.contactLink} href="https://github.com/sumanbiswas7" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className={styles.contactLink} href="https://x.com/hellosumanx" target="_blank" rel="noopener noreferrer">
                Twitter
              </a>
              <a className={styles.contactLink} href="https://www.linkedin.com/in/sumanbiswas7" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
          <footer className={styles.pageFooter}>
            <div className={styles.pageFooterViews}>
              <Eye size={11} />
              <span>{views.toLocaleString()} visits</span>
            </div>
            <span>© {new Date().getFullYear()} Suman Biswas</span>
          </footer>
        </div>
      </ScrollLayout>
    </EliProvider>
  );
}

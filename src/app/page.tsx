import Navbar from "@/components/Navbar/Navbar";
import BentoGrid from "@/components/BentoGrid/BentoGrid";
import { BentoGridProvider } from "@/components/BentoGrid/BentoGridContext";
import { EliProvider } from "@/context/EliContext";
import EliTerminal from "@/components/EliTerminal/EliTerminal";
import ScrollLayout from "@/components/ScrollLayout";
import ProjectsSection from "@/components/ProjectsSection";
import styles from "./page.module.scss";

export default function Home() {
  return (
    <EliProvider>
      <EliTerminal />
      <ScrollLayout>
        <BentoGridProvider>
          <div id="home" className={styles.section1}>
            <Navbar />
            <BentoGrid />
          </div>
        </BentoGridProvider>

        <div className={styles.sectionBreak}>
          <span className={styles.sectionBreakLine} />
          <span className={styles.sectionBreakLabel}>what i&apos;ve built &amp; building</span>
          <span className={styles.sectionBreakLine} />
        </div>

        <ProjectsSection />

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
              <a className={styles.contactLink} href="mailto:textsumanb@gmail.com">
                textsumanb@gmail.com
              </a>
              <a className={styles.contactLink} href="https://github.com/sumanbiswas7" target="_blank" rel="noopener noreferrer">
                GitHub
              </a>
              <a className={styles.contactLink} href="https://x.com/hellosumanx" target="_blank" rel="noopener noreferrer">
                Twitter / X
              </a>
              <a className={styles.contactLink} href="https://www.linkedin.com/in/sumanbiswas7" target="_blank" rel="noopener noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </ScrollLayout>
    </EliProvider>
  );
}

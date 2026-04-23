"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import BentoGrid from "@/components/BentoGrid/BentoGrid";
import { BentoGridProvider } from "@/components/BentoGrid/BentoGridContext";
import styles from "./page.module.scss";

const PROJECTS = [
  {
    title: "Terrain OS",
    desc: "Procedural terrain generation engine with real-time erosion simulation and biome blending across infinite worlds.",
    tags: ["WebGL", "TypeScript", "WASM"],
    year: "2024",
  },
  {
    title: "Lumina",
    desc: "Real-time collaborative design tool built for distributed teams with conflict-free editing and live cursors.",
    tags: ["React", "WebSockets", "CRDTs"],
    year: "2024",
  },
  {
    title: "Hollow",
    desc: "Minimalist note-taking app with local-first sync, end-to-end encryption, and a distraction-free writing mode.",
    tags: ["Tauri", "Rust", "SQLite"],
    year: "2023",
  },
  {
    title: "Cascade",
    desc: "Visual workflow automation platform with a node-based editor, webhook triggers, and an open plugin ecosystem.",
    tags: ["Next.js", "PostgreSQL", "Redis"],
    year: "2023",
  },
];

export default function Home() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollEl = scrollAreaRef.current;
    const homeEl = document.getElementById("home");
    if (!scrollEl || !homeEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setSidebarExpanded(!entry.isIntersecting),
      { root: scrollEl, threshold: 0.5 },
    );
    observer.observe(homeEl);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar expanded={sidebarExpanded} />
      <div ref={scrollAreaRef} className={styles.scrollArea}>
        <BentoGridProvider>
          <div id="home" className={styles.section1}>
            <Navbar />
            <BentoGrid />
          </div>
        </BentoGridProvider>

        {/* Section 2: Work */}
        <div id="work" className={styles.section2}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Selected projects</span>
            <h2 className={styles.sectionTitle}>Work</h2>
          </div>
          <div className={styles.projectsGrid}>
            {PROJECTS.map((p) => (
              <div key={p.title} className={styles.projectCard}>
                <div className={styles.projectMeta}>
                  <span className={styles.projectYear}>{p.year}</span>
                </div>
                <h3 className={styles.projectTitle}>{p.title}</h3>
                <p className={styles.projectDesc}>{p.desc}</p>
                <div className={styles.projectTags}>
                  {p.tags.map((t) => (
                    <span key={t} className={styles.tag}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Contact */}
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
              <a className={styles.contactLink} href="mailto:hello@example.com">
                hello@example.com
              </a>
              <a className={styles.contactLink} href="#">
                GitHub
              </a>
              <a className={styles.contactLink} href="#">
                Twitter / X
              </a>
              <a className={styles.contactLink} href="#">
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

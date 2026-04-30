"use client";
import { useRef, useState, useEffect, ReactNode } from "react";
import Sidebar from "@/components/Sidebar/Sidebar";
import styles from "@/app/page.module.scss";

export default function ScrollLayout({ children }: { children: ReactNode }) {
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
        {children}
      </div>
    </div>
  );
}

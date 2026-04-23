"use client";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import BentoGrid from "@/components/BentoGrid/BentoGrid";
import { BentoGridProvider } from "@/components/BentoGrid/BentoGridContext";
import Image from "next/image";
import { ExternalLink, GitFork } from "lucide-react";
import Button from "@/components/ui/Button";
import styles from "./page.module.scss";

const PROJECTS = [
  {
    id: 1,
    title: "Marked",
    description:
      "A versatile solution for link management, task tracking, note-taking, and expense management with convenient reminders.",
    img: "/work/cover-marked.webp",
    tags: ["NextJS", "NodeJs", "Turborepo", "Express"],
    github: "https://github.com/sumanbiswas7/marked",
    live: "https://marked-web.vercel.app/",
    org: "Personal",
  },
  {
    id: 2,
    title: "Signinlink",
    description:
      "Transform your business: Go paperless, digitize operations, and slash costs from up to $6000 to just $20 per month!",
    img: "/work/cover-signinlink.webp",
    tags: ["Rollup", "Storybook", "NPM", "React"],
    github: "https://github.com/sumanbiswas7",
    live: "https://signinlink.app",
    org: "Web-wizs",
  },
  {
    id: 3,
    title: "Poshkit",
    description:
      "A collection of modern, fancy components with amazing hover effects for React applications. Easily add stylish and interactive UI elements to your webapps.",
    img: "/work/cover-poshkit.webp",
    tags: ["Rollup", "Storybook", "NPM", "React"],
    github: "https://github.com/sumanbiswas7/poshkit",
    live: "https://www.npmjs.com/package/poshkit",
    org: "Personal",
  },
  {
    id: 4,
    title: "Cinematic",
    description:
      "A platform that provides movie lovers with an immersive experience to discover, share, and indulge in their favorite movies.",
    img: "/work/cover-cinematic.webp",
    tags: ["NextJS", "Postgres", "AWS", "Sass", "GraphQL"],
    github: "https://github.com/sumanbiswas7/cinematic",
    live: "https://cinematic-web.vercel.app",
    org: "Personal",
  },
  {
    id: 5,
    title: "Vivid",
    description:
      "A social media app for mobile where people can share images, like, comment, and many more.",
    img: "/work/cover-vivid.webp",
    tags: ["React Native", "Redux", "Cloudinary", "Firebase"],
    github: "https://github.com/sumanbiswas7/vivid",
    live: "https://play.google.com/store/apps/details?id=com.suman_biswas.vivid&pli=1",
    org: "Personal",
  },
];

function getDomain(url: string) {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

type Comment = { id: number; text: string };
type Reactions = Record<number, { liked: boolean; likes: number; comments: Comment[] }>;

function initReactions(): Reactions {
  return Object.fromEntries(
    PROJECTS.map((p) => [p.id, { liked: false, likes: 0, comments: [] }]),
  );
}

export default function Home() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const [reactions, setReactions] = useState<Reactions>(() => {
    if (typeof window === "undefined") return initReactions();
    try {
      const s = localStorage.getItem("project-reactions");
      return s ? { ...initReactions(), ...JSON.parse(s) } : initReactions();
    } catch {
      return initReactions();
    }
  });

  const [openComments, setOpenComments] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    localStorage.setItem("project-reactions", JSON.stringify(reactions));
  }, [reactions]);

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

  function toggleLike(id: number) {
    setReactions((prev) => {
      const r = prev[id];
      return {
        ...prev,
        [id]: { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 },
      };
    });
  }

  function addComment(id: number) {
    const text = (commentInputs[id] ?? "").trim();
    if (!text) return;
    setReactions((prev) => {
      const r = prev[id];
      return {
        ...prev,
        [id]: { ...r, comments: [...r.comments, { id: Date.now(), text }] },
      };
    });
    setCommentInputs((prev) => ({ ...prev, [id]: "" }));
  }

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
          {PROJECTS.map((p, i) => {
            const r = reactions[p.id];
            const isCommentsOpen = openComments[p.id] ?? false;
            return (
              <div key={p.id} className={styles.projectRow}>
                <div className={styles.projectCard}>

                  {/* Left panel */}
                  <div className={styles.projectLeft}>

                    {/* Top: meta + title + desc */}
                    <div className={styles.projectTop}>
                      <div className={styles.projectMeta}>
                        <span className={styles.projectIndex}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={styles.projectOrg}>{p.org}</span>
                      </div>

                      <h3 className={styles.projectTitle}>{p.title}</h3>
                      <p className={styles.projectDesc}>{p.description}</p>

                      <div className={styles.projectTags}>
                        {p.tags.map((t) => (
                          <span key={t} className={styles.tag}>{t}</span>
                        ))}
                      </div>

                      <div className={styles.projectLinks}>
                        <Button
                          label="Live site"
                          icon={ExternalLink}
                          variant="primary"
                          href={p.live}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                        <Button
                          label="GitHub"
                          icon={GitFork}
                          variant="secondary"
                          href={p.github}
                          target="_blank"
                          rel="noopener noreferrer"
                        />
                      </div>
                    </div>

                    {/* Bottom: reactions */}
                    <div className={styles.projectBottom}>
                      <div className={styles.reactionsBar}>
                        <button
                          className={`${styles.reactionBtn} ${r.liked ? styles.liked : ""}`}
                          onClick={() => toggleLike(p.id)}
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill={r.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                          </svg>
                          <span>{r.likes > 0 ? r.likes : "Like"}</span>
                        </button>

                        <button
                          className={`${styles.reactionBtn} ${isCommentsOpen ? styles.active : ""}`}
                          onClick={() =>
                            setOpenComments((prev) => ({ ...prev, [p.id]: !prev[p.id] }))
                          }
                        >
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                          <span>
                            {r.comments.length > 0
                              ? `${r.comments.length} comment${r.comments.length > 1 ? "s" : ""}`
                              : "Comment"}
                          </span>
                        </button>
                      </div>

                      {isCommentsOpen && (
                        <div className={styles.commentsPanel}>
                          <div className={styles.commentsList}>
                            {r.comments.length === 0 && (
                              <p className={styles.noComments}>No comments yet.</p>
                            )}
                            {r.comments.map((c) => (
                              <div key={c.id} className={styles.commentItem}>
                                <span className={styles.commentAuthor}>anon</span>
                                <span className={styles.commentText}>{c.text}</span>
                              </div>
                            ))}
                          </div>
                          <div className={styles.commentInputRow}>
                            <input
                              className={styles.commentInput}
                              placeholder="Leave a comment…"
                              value={commentInputs[p.id] ?? ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [p.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") addComment(p.id);
                              }}
                            />
                            <button
                              className={styles.commentSubmit}
                              onClick={() => addComment(p.id)}
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right panel: browser mockup */}
                  <div className={styles.projectRight}>
                    <div className={styles.browserMockup}>
                      <div className={styles.browserBar}>
                        <div className={styles.trafficLights}>
                          <span className={`${styles.dot} ${styles.dotRed}`} />
                          <span className={`${styles.dot} ${styles.dotYellow}`} />
                          <span className={`${styles.dot} ${styles.dotGreen}`} />
                        </div>
                        <div className={styles.urlBar}>
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" opacity="0.4">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                          </svg>
                          <span>{getDomain(p.live)}</span>
                        </div>
                        <div className={styles.browserActions}>
                          <a
                            href={p.live}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.browserOpenBtn}
                            title="Open site"
                          >
                            ↗
                          </a>
                        </div>
                      </div>
                      <div className={styles.browserContent}>
                        <Image
                          src={p.img}
                          alt={p.title}
                          fill
                          className={styles.projectCover}
                        />
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
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
              <a className={styles.contactLink} href="#">GitHub</a>
              <a className={styles.contactLink} href="#">Twitter / X</a>
              <a className={styles.contactLink} href="#">LinkedIn</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

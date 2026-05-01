"use client";
import { useState } from "react";
import Image from "next/image";
import { ExternalLink, GitFork } from "lucide-react";
import Button from "@/components/ui/Button";
import styles from "@/app/page.module.scss";


const PROJECTS = [
  {
    id: 1,
    title: "Beam",
    description:
      "AI coding assistant for VS Code. Run local models with Ollama for free, bring your own OpenAI key, or stay fully offline — no mandatory subscription.",
    media: [
      { type: "image" as const, src: "/products/beam-cover.webp" },
      { type: "video" as const, src: "https://sumanbiswas-website.s3.ap-south-1.amazonaws.com/beam-demo-explain.MP4" },
      { type: "video" as const, src: "https://sumanbiswas-website.s3.ap-south-1.amazonaws.com/beam-demo-stock-fetch.MP4" },
      { type: "image" as const, src: "/products/beam-2.webp" },
    ],
    tags: ["VS Code Extension", "Ollama", "OpenAI", "TypeScript"],
    github: null as string | null,
    live: "https://getbeam.vercel.app" as string | null,
    org: "Personal",
    year: "2025",
    ongoing: true,
  },
  {
    id: 2,
    title: "Prayash",
    description:
      "An initiative supporting underprivileged students through book donations, community connections, and an annual event with Quiz, Drawings, and Abbriti competitions.",
    media: [
      { type: "image" as const, src: "/products/prayash-cover.webp" },
      { type: "image" as const, src: "/products/prayash-2.webp" },
      { type: "image" as const, src: "/products/prayash-3.webp" },
    ],
    tags: ["Community", "Education", "Social Impact"],
    github: null as string | null,
    live: null as string | null,
    org: "Prayash",
    year: "2023",
    ongoing: true,
  },
  {
    id: 3,
    title: "Marked",
    description:
      "A versatile solution for link management, task tracking, note-taking, and expense management with convenient reminders.",
    media: [
      { type: "image" as const, src: "/products/marked-cover.webp" },
      { type: "image" as const, src: "/products/marked-2.webp" },
    ],
    tags: ["NextJS", "NodeJs", "Turborepo", "Express"],
    github: "https://github.com/sumanbiswas7/marked" as string | null,
    live: "https://marked-web.vercel.app/" as string | null,
    org: "Personal",
    year: "2023",
    ongoing: false,
  },
  {
    id: 4,
    title: "Signinlink",
    description:
      "Transform your business: Go paperless, digitize operations, and slash costs from up to $6000 to just $20 per month!",
    media: [
      { type: "image" as const, src: "/products/signinlink-cover.webp" },
      { type: "image" as const, src: "/products/signinlink-2.webp" },
      { type: "image" as const, src: "/products/signinlink-3.webp" },
    ],
    tags: ["Rollup", "Storybook", "NPM", "React"],
    github: "https://github.com/sumanbiswas7" as string | null,
    live: "https://signinlink.app" as string | null,
    org: "Web-wizs",
    year: "2024",
    ongoing: false,
  },
  {
    id: 5,
    title: "Poshkit",
    description:
      "A collection of modern, fancy components with amazing hover effects for React applications. Easily add stylish and interactive UI elements to your webapps.",
    media: [{ type: "image" as const, src: "/products/poshkit-cover.webp" }],
    tags: ["Rollup", "Storybook", "NPM", "React"],
    github: "https://github.com/sumanbiswas7/poshkit" as string | null,
    live: "https://www.npmjs.com/package/poshkit" as string | null,
    org: "Personal",
    year: "2023",
    ongoing: false,
  },
  {
    id: 7,
    title: "Vivid",
    description:
      "A social media app for mobile where people can share images, like, comment, and many more.",
    media: [{ type: "image" as const, src: "/products/vivid-cover.webp" }],
    tags: ["React Native", "Redux", "Cloudinary", "Firebase"],
    github: "https://github.com/sumanbiswas7/vivid" as string | null,
    live: "https://play.google.com/store/apps/details?id=com.suman_biswas.vivid&pli=1" as string | null,
    org: "Personal",
    year: "2022",
    ongoing: false,
  },
];

type Comment = { id: number; text: string; ts: number };
type Reactions = Record<number, { liked: boolean; likes: number; comments: Comment[] }>;

function getDomain(url: string | null) {
  if (!url) return "—";
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

function timeAgo(ts: number): string {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function getYoutubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}` : null;
}

function initReactions(): Reactions {
  return Object.fromEntries(
    PROJECTS.map((p) => [p.id, { liked: false, likes: 0, comments: [] }]),
  );
}

export default function ProjectsSection() {
  const [reactions, setReactions] = useState<Reactions>(() => {
    if (typeof window === "undefined") return initReactions();
    try {
      const s = localStorage.getItem("project-reactions");
      return s ? { ...initReactions(), ...JSON.parse(s) } : initReactions();
    } catch {
      return initReactions();
    }
  });
  const [openComposer, setOpenComposer] = useState<Record<number, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>({});
  const [slides, setSlides] = useState<Record<number, number>>({});

  function toggleLike(id: number) {
    setReactions((prev) => {
      const r = prev[id];
      const next = {
        ...prev,
        [id]: { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 },
      };
      localStorage.setItem("project-reactions", JSON.stringify(next));
      return next;
    });
  }

  function addComment(id: number) {
    const text = (commentInputs[id] ?? "").trim();
    if (!text) return;
    setReactions((prev) => {
      const r = prev[id];
      const next = {
        ...prev,
        [id]: { ...r, comments: [...r.comments, { id: Date.now(), text, ts: Date.now() }] },
      };
      localStorage.setItem("project-reactions", JSON.stringify(next));
      return next;
    });
    setCommentInputs((prev) => ({ ...prev, [id]: "" }));
  }

  function goSlide(id: number, dir: 1 | -1, total: number) {
    setSlides((prev) => ({
      ...prev,
      [id]: ((prev[id] ?? 0) + dir + total) % total,
    }));
  }

  return (
    <div id="work" className={styles.section2}>
      {PROJECTS.map((p, i) => {
        const r = reactions[p.id];
        const isCommentsOpen = r.comments.length > 0;
        const currentSlide = slides[p.id] ?? 0;
        const hasMultiple = p.media.length > 1;

        return (
          <div key={p.id} className={styles.projectRow}>
            <div className={styles.projectCard}>
              <div className={styles.projectLeft}>
                <div className={styles.projectTop}>
                  <div className={styles.projectMeta}>
                    <div className={styles.projectMetaLeft}>
                      <span className={styles.projectIndex}>{String(i + 1).padStart(2, "0")}</span>
                      <span className={styles.projectOrg}>{p.org}</span>
                    </div>
                    <div className={styles.projectMetaRight}>
                      <span className={styles.projectYear}>{p.year}</span>
                      {p.ongoing && <span className={styles.ongoingBadge}>Ongoing</span>}
                    </div>
                  </div>
                  <h3 className={styles.projectTitle}>{p.title}</h3>
                  <p className={styles.projectDesc}>{p.description}</p>
                  <div className={styles.projectTags}>
                    {p.tags.map((t) => (
                      <span key={t} className={styles.tag}>{t}</span>
                    ))}
                  </div>
                  <div className={styles.projectLinks}>
                    {p.live && (
                      <Button label="Live site" icon={ExternalLink} variant="primary" href={p.live} target="_blank" rel="noopener noreferrer" />
                    )}
                    {p.github && (
                      <Button label="GitHub" icon={GitFork} variant="secondary" href={p.github} target="_blank" rel="noopener noreferrer" />
                    )}
                  </div>
                </div>

                <div className={styles.projectBottom}>
                  {isCommentsOpen && (
                    <div className={styles.commentsSection}>
                      {r.comments.map((c) => (
                        <div key={c.id} className={styles.commentBubble}>
                          <p className={styles.commentText}>{c.text}</p>
                          <span className={styles.commentMeta}>anon · {timeAgo(c.ts)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className={styles.reactionsBar}>
                    <button
                      className={`${styles.likeBtn} ${r.liked ? styles.liked : ""}`}
                      onClick={() => toggleLike(p.id)}
                    >
                      <span className={styles.likeHeart}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill={r.liked ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2.2">
                          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                        </svg>
                      </span>
                      {r.likes > 0 && <span className={styles.likeCount}>{r.likes}</span>}
                    </button>

                    <button
                      className={`${styles.commentToggle} ${openComposer[p.id] ? styles.commentToggleActive : ""}`}
                      onClick={() => setOpenComposer((prev) => ({ ...prev, [p.id]: !prev[p.id] }))}
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {r.comments.length > 0
                        ? `${r.comments.length} comment${r.comments.length > 1 ? "s" : ""}`
                        : "Add comment"}
                    </button>

                    {openComposer[p.id] && (
                      <div className={styles.composerPopup}>
                        <input
                          autoFocus
                          className={styles.composerInput}
                          placeholder="Write a comment…"
                          value={commentInputs[p.id] ?? ""}
                          onChange={(e) => setCommentInputs((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") { addComment(p.id); setOpenComposer((prev) => ({ ...prev, [p.id]: false })); }
                            if (e.key === "Escape") setOpenComposer((prev) => ({ ...prev, [p.id]: false }));
                          }}
                        />
                        <button className={styles.sendBtn} onClick={() => { addComment(p.id); setOpenComposer((prev) => ({ ...prev, [p.id]: false })); }} aria-label="Post comment">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                          </svg>
                        </button>
                        <button className={styles.closeBtn} onClick={() => setOpenComposer((prev) => ({ ...prev, [p.id]: false }))} aria-label="Close">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

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
                      {p.live && (
                        <a href={p.live} target="_blank" rel="noopener noreferrer" className={styles.browserOpenBtn} title="Open site">↗</a>
                      )}
                    </div>
                  </div>

                  <div className={styles.browserContent}>
                    {p.media.map((item, idx) => {
                      const isActive = idx === currentSlide;
                      const slideClass = `${styles.carouselSlide} ${isActive ? styles.carouselSlideActive : ""}`;
                      if (item.type === "image") {
                        return (
                          <div key={idx} className={slideClass}>
                            <Image
                              src={item.src}
                              alt={`${p.title} screenshot ${idx + 1}`}
                              fill
                              sizes="(max-width: 768px) 100vw, 50vw"
                              className={styles.projectCover}
                            />
                          </div>
                        );
                      }
                      const embedUrl = getYoutubeEmbedUrl(item.src);
                      return embedUrl ? (
                        <div key={idx} className={slideClass}>
                          <iframe
                            src={embedUrl}
                            className={styles.videoEmbed}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title={`${p.title} demo ${idx + 1}`}
                          />
                        </div>
                      ) : (
                        <div key={idx} className={slideClass}>
                          <video
                            src={item.src}
                            className={styles.videoEmbed}
                            autoPlay
                            muted
                            loop
                            playsInline
                          />
                        </div>
                      );
                    })}

                    {hasMultiple && (
                      <>
                        <button
                          className={`${styles.carouselArrow} ${styles.carouselPrev}`}
                          onClick={() => goSlide(p.id, -1, p.media.length)}
                          aria-label="Previous slide"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="15 18 9 12 15 6" />
                          </svg>
                        </button>
                        <button
                          className={`${styles.carouselArrow} ${styles.carouselNext}`}
                          onClick={() => goSlide(p.id, 1, p.media.length)}
                          aria-label="Next slide"
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <polyline points="9 18 15 12 9 6" />
                          </svg>
                        </button>
                        <div className={styles.carouselDots}>
                          {p.media.map((_, idx) => (
                            <button
                              key={idx}
                              className={`${styles.carouselDot} ${idx === currentSlide ? styles.carouselDotActive : ""}`}
                              onClick={() => setSlides((prev) => ({ ...prev, [p.id]: idx }))}
                              aria-label={`Go to slide ${idx + 1}`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

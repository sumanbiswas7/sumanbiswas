"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, Download, Pencil, Gamepad2, Play, X, Eraser, Trash2, Lightbulb, Plus } from "lucide-react";
import Image from "next/image";
import Card from "./Card";
import Button from "@/components/ui/Button";
import NoteCard from "./NoteCard";
import EliCard from "./EliCard";
import GalleryCard from "./GalleryCard";
import WorkCard from "./WorkCard";
import NowPlayingCard from "./NowPlayingCard";
import QuickLinksCard from "./QuickLinksCard";
import styles from "./BentoGrid.module.scss";
import { useBentoGrid, type CardId } from "./BentoGridContext";
import { useGame } from "@/context/GameContext";

type Pos = { row: number; col: number };

function reorder(rows: CardId[][], from: Pos, to: Pos): CardId[][] {
  const next = rows.map((r) => [...r]);
  const card = next[from.row][from.col];
  next[from.row].splice(from.col, 1);
  const toCol = from.row === to.row && from.col < to.col ? to.col - 1 : to.col;
  next[to.row].splice(toCol, 0, card);
  return next;
}

function renderCard(id: CardId) {
  switch (id) {
    case "me":
      return <MeCard />;
    case "meHero":
      return <MeHeroImgCard />;
    case "stacked":
      return (
        <div className={styles.stackedCards}>
          <NowPlayingCard />
          <QuickLinksCard />
        </div>
      );
    case "gallery":
      return <GalleryCard />;
    // case "note":
    //   return <NoteCard />;
    case "bio":
      return <BioCard />;
    case "playGame":
      return <PlayGameCard />;
    case "work":
      return <WorkCard />;
    case "eli":
      return <EliCard />;
    case "projectIdeas":
      return <ProjectIdeasCard />;
  }
}

export default function BentoGrid() {
  const { rows, setRows, shuffleCount } = useBentoGrid();
  const [draggingId, setDraggingId] = useState<CardId | null>(null);
  const [overPos, setOverPos] = useState<Pos | null>(null);

  const dragFrom = useRef<Pos | null>(null);
  const lastOver = useRef<Pos | null>(null);

  const handleDragStart = useCallback(
    (e: React.DragEvent, cardId: CardId, row: number, col: number) => {
      dragFrom.current = { row, col };
      setDraggingId(cardId);
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      if (dragFrom.current?.row !== row) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      if (lastOver.current?.row !== row || lastOver.current?.col !== col) {
        lastOver.current = { row, col };
        setOverPos({ row, col });
      }
    },
    [],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent, row: number, col: number) => {
      e.preventDefault();
      const from = dragFrom.current;
      if (!from || from.row !== row || (from.row === row && from.col === col)) {
        dragFrom.current = null;
        setDraggingId(null);
        setOverPos(null);
        lastOver.current = null;
        return;
      }
      setRows((prev) => reorder(prev, from, { row, col }));
      dragFrom.current = null;
      setDraggingId(null);
      setOverPos(null);
      lastOver.current = null;
    },
    [setRows],
  );

  const handleDragEnd = useCallback(() => {
    dragFrom.current = null;
    setDraggingId(null);
    setOverPos(null);
    lastOver.current = null;
  }, []);

  // Alternate keyframe name so the browser replays the animation on every shuffle
  const animName = shuffleCount % 2 === 0 ? "cardShuffleA" : "cardShuffleB";

  return (
    <div className={styles.grid}>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className={styles.gridRow}>
          {row.map((cardId, colIdx) => {
            const isDragging = draggingId === cardId;
            const isOver =
              overPos?.row === rowIdx &&
              overPos?.col === colIdx &&
              draggingId !== cardId;
            const globalIdx =
              rows.slice(0, rowIdx).reduce((s, r) => s + r.length, 0) + colIdx;
            const shuffleStyle: React.CSSProperties =
              shuffleCount > 0
                ? {
                    animation: `${animName} 0.55s ease-in-out ${globalIdx * 40}ms`,
                    transition: "none",
                  }
                : {};
            return (
              <div
                key={cardId}
                draggable
                onDragStart={(e) => handleDragStart(e, cardId, rowIdx, colIdx)}
                onDragOver={(e) => handleDragOver(e, rowIdx, colIdx)}
                onDrop={(e) => handleDrop(e, rowIdx, colIdx)}
                onDragEnd={handleDragEnd}
                style={shuffleStyle}
                className={[
                  styles.draggableCard,
                  isDragging ? styles.dragging : "",
                  isOver ? styles.dragOver : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renderCard(cardId)}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function MeCard() {
  return (
    <Card className={styles.meGrid}>
      <div className={styles.meGridTop}>
        <span className={styles.cardTitle}>ME</span>
      </div>

      <h1 className={styles.headline}>
        I build <span className={styles.accent}>digital</span> products that are <span className={styles.accent}>worth using.</span>
      </h1>

      <p className={styles.sub}>
        Full-stack engineer building modern, impactful products that solve real problems.
      </p>

      <div className={styles.actions}>
        <Button label="View My Work" icon={ArrowRight} variant="primary" />
        <Button label="Download CV" icon={Download} variant="secondary" />
      </div>
    </Card>
  );
}

function BioCard() {
  return (
    <Card className={styles.bioCard}>
      <div className={styles.bioLeft}>
        <span className={styles.cardTitle}>BIO</span>
        <p className={`${styles.sub} ${styles.bioDesc}`}>
          Self-taught Full-stack Engineer who loves building modern, impactful products that solve real problems.
          TypeScript is my main tool, but I use whatever fits best.
          <br/>
          <br/>
          Outside of code — football, photography, and the mountains.{" "}
          <a href="https://www.instagram.com/realmadrid" target="_blank" rel="noopener noreferrer" className={styles.bioLink}>Real Madrid</a>{" "}
          is part of who I am, and {" "}
          <a href="https://bernabeu.realmadrid.com/en-US" target="_blank" rel="noopener noreferrer" className={styles.bioLink}>Santiago Bernabéu</a>{" "}
          is my second home.
        </p>
      </div>
      <div className={styles.bioCoverWrap}>
        <Image
          src="/gallery/gallery-4.jpg"
          alt="Parrot"
          fill
          sizes="200px"
          className={styles.bioCoverImg}
        />
      </div>
    </Card>
  );
}

const PATTERNS = [
  { id: "none", label: "None", svg: null },
  { id: "dots", label: "Dots", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><circle cx='10' cy='10' r='2' fill='rgba(255,255,255,0.28)'/></svg>` },
  { id: "grid", label: "Grid", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path d='M24 0L0 0 0 24' fill='none' stroke='rgba(255,255,255,0.22)' stroke-width='1'/></svg>` },
  { id: "diagonal", label: "Diagonal", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><line x1='0' y1='16' x2='16' y2='0' stroke='rgba(255,255,255,0.26)' stroke-width='1.5'/></svg>` },
  { id: "stars", label: "Stars", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='36' height='36'><text x='6' y='26' font-size='20' fill='rgba(255,255,255,0.28)'>✦</text></svg>` },
  { id: "circles", label: "Circles", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='30' height='30'><circle cx='15' cy='15' r='9' fill='none' stroke='rgba(255,255,255,0.24)' stroke-width='1'/></svg>` },
  { id: "crosses", label: "Crosses", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20'><line x1='10' y1='4' x2='10' y2='16' stroke='rgba(255,255,255,0.28)' stroke-width='1.5'/><line x1='4' y1='10' x2='16' y2='10' stroke='rgba(255,255,255,0.28)' stroke-width='1.5'/></svg>` },
  { id: "zigzag", label: "Zigzag", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='32' height='12'><polyline points='0,10 8,2 16,10 24,2 32,10' fill='none' stroke='rgba(255,255,255,0.28)' stroke-width='1.5'/></svg>` },
  { id: "triangles", label: "Triangles", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='28' height='24'><polygon points='14,3 26,21 2,21' fill='none' stroke='rgba(255,255,255,0.26)' stroke-width='1'/></svg>` },
  { id: "noise", label: "Noise", svg: `<svg xmlns='http://www.w3.org/2000/svg' width='40' height='40'><circle cx='5' cy='8' r='1.2' fill='rgba(255,255,255,0.22)'/><circle cx='18' cy='3' r='0.8' fill='rgba(255,255,255,0.18)'/><circle cx='30' cy='15' r='1.5' fill='rgba(255,255,255,0.22)'/><circle cx='10' cy='25' r='0.9' fill='rgba(255,255,255,0.2)'/><circle cx='35' cy='30' r='1.2' fill='rgba(255,255,255,0.22)'/><circle cx='22' cy='35' r='0.7' fill='rgba(255,255,255,0.18)'/></svg>` },
];

function svgToDataUri(svg: string) {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const BG_PRESETS = [
  "#9aa59a", "#b8a394", "#1e3a5f", "#3d2b1f",
  "#2d4a3e", "#4a2d5a", "#1e1e1e", "#c25e5e",
];

const BRUSH_COLORS = [
  "#ffffff", "#000000", "#ff4444", "#ff8c00",
  "#ffdd00", "#44cc44", "#4488ff", "#cc44ff", "#ff88cc",
];

const CANVAS_W = 320;
const CANVAS_H = 440;

function MeHeroImgCard() {
  const [isEditing, setIsEditing] = useState(false);
  const [bgColor, setBgColor] = useState("#9aa59a");
  const [bgPattern, setBgPattern] = useState("zigzag");
  const [graffiti, setGraffiti] = useState<string | null>(null);
  const [drawColor, setDrawColor] = useState("#ffffff");
  const [brushSize, setBrushSize] = useState(4);
  const [tool, setTool] = useState<"pen" | "eraser">("pen");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!isEditing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
    if (graffiti) {
      const img = new window.Image();
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.src = graffiti;
    }
  }, [isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  const getPoint = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = CANVAS_W / rect.width;
    const scaleY = CANVAS_H / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: (touch.clientX - rect.left) * scaleX, y: (touch.clientY - rect.top) * scaleY };
    }
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    isDrawingRef.current = true;
    const pt = getPoint(e, canvas);
    lastPointRef.current = pt;
    const ctx = canvas.getContext("2d")!;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, (tool === "eraser" ? brushSize * 3 : brushSize) / 2, 0, Math.PI * 2);
    ctx.fillStyle = drawColor;
    ctx.fill();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const pt = getPoint(e, canvas);
    const last = lastPointRef.current ?? pt;
    ctx.globalCompositeOperation = tool === "eraser" ? "destination-out" : "source-over";
    ctx.beginPath();
    ctx.moveTo(last.x, last.y);
    ctx.lineTo(pt.x, pt.y);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = tool === "eraser" ? brushSize * 3 : brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    lastPointRef.current = pt;
  };

  const endDraw = () => {
    isDrawingRef.current = false;
    lastPointRef.current = null;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.getContext("2d")!.clearRect(0, 0, CANVAS_W, CANVAS_H);
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    setGraffiti(canvas ? canvas.toDataURL() : null);
    setIsEditing(false);
  };

  return (
    <>
      <Card className={styles.meHeroImgCard} style={{ backgroundColor: bgColor }}>
        <button
          className={styles.meHeroEditBtn}
          aria-label="Edit photo"
          onClick={() => setIsEditing(true)}
        >
          <Pencil size={14} />
        </button>
        {bgPattern !== "none" && (
          <div
            className={styles.meHeroPatternLayer}
            style={{ backgroundImage: svgToDataUri(PATTERNS.find(p => p.id === bgPattern)!.svg!) }}
          />
        )}
        <div className={styles.meHeroImgWrapper}>
          <Image src="/me.webp" alt="Suman Biswas" fill priority sizes="(max-width: 768px) 100vw, 50vw" className={styles.meHeroImg} />
          {graffiti && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={graffiti} alt="" className={styles.meHeroGraffitiOverlay} aria-hidden />
          )}
        </div>
      </Card>

      {isEditing && createPortal(
        <div
          className={styles.meHeroEditModal}
          onMouseDown={(e) => { if (e.target === e.currentTarget) setIsEditing(false); }}
        >
          <div className={styles.meHeroEditPanel}>
            {/* Left: canvas preview */}
            <div className={styles.meHeroEditPreview} style={{ backgroundColor: bgColor }}>
              {bgPattern !== "none" && (
                <div
                  className={styles.meHeroPatternLayer}
                  style={{ backgroundImage: svgToDataUri(PATTERNS.find(p => p.id === bgPattern)!.svg!) }}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/me.webp" alt="" className={styles.meHeroEditPreviewImg} />
              <canvas
                ref={canvasRef}
                width={CANVAS_W}
                height={CANVAS_H}
                className={styles.meHeroDrawCanvas}
                style={{ cursor: tool === "eraser" ? "cell" : "crosshair" }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={endDraw}
                onMouseLeave={endDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={endDraw}
              />
            </div>

            {/* Right: controls */}
            <div className={styles.meHeroEditControls}>
              <div className={styles.meHeroEditHeader}>
                <span className={styles.meHeroEditTitle}>Edit Photo</span>
                <button className={styles.meHeroEditClose} onClick={() => setIsEditing(false)}>
                  <X size={16} />
                </button>
              </div>

              <div className={styles.meHeroEditSection}>
                <span className={styles.meHeroEditLabel}>Background</span>
                <div className={styles.meHeroSwatches}>
                  {BG_PRESETS.map((c) => (
                    <button
                      key={c}
                      className={`${styles.meHeroSwatch} ${bgColor === c ? styles.meHeroSwatchActive : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => setBgColor(c)}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.meHeroEditSection}>
                <span className={styles.meHeroEditLabel}>Background Elements</span>
                <div className={styles.meHeroPatternGrid}>
                  {PATTERNS.map((p) => (
                    <button
                      key={p.id}
                      title={p.label}
                      className={`${styles.meHeroPatternBtn} ${bgPattern === p.id ? styles.meHeroPatternBtnActive : ""}`}
                      style={p.svg ? { backgroundImage: svgToDataUri(p.svg), backgroundColor: bgColor } : {}}
                      onClick={() => setBgPattern(p.id)}
                    >
                      {p.id === "none" && <span className={styles.meHeroPatternNone} />}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.meHeroEditSection}>
                <span className={styles.meHeroEditLabel}>Brush Color</span>
                <div className={styles.meHeroSwatches}>
                  {BRUSH_COLORS.map((c) => (
                    <button
                      key={c}
                      className={`${styles.meHeroSwatch} ${drawColor === c && tool === "pen" ? styles.meHeroSwatchActive : ""}`}
                      style={{ backgroundColor: c }}
                      onClick={() => { setDrawColor(c); setTool("pen"); }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.meHeroEditSection}>
                <div className={styles.meHeroEditTools}>
                  <button
                    className={`${styles.meHeroToolBtn} ${tool === "pen" ? styles.meHeroToolBtnActive : ""}`}
                    onClick={() => setTool("pen")}
                  >
                    <Pencil size={13} /> Pen
                  </button>
                  <button
                    className={`${styles.meHeroToolBtn} ${tool === "eraser" ? styles.meHeroToolBtnActive : ""}`}
                    onClick={() => setTool("eraser")}
                  >
                    <Eraser size={13} /> Eraser
                  </button>
                  <button className={styles.meHeroToolBtn} onClick={clearCanvas}>
                    <Trash2 size={13} /> Clear
                  </button>
                </div>
                <div className={styles.meHeroBrushRow}>
                  <span className={styles.meHeroEditLabel}>Size {brushSize}px</span>
                  <input
                    type="range"
                    min={2}
                    max={24}
                    value={brushSize}
                    onChange={(e) => setBrushSize(Number(e.target.value))}
                    className={styles.meHeroBrushSlider}
                  />
                </div>
              </div>

              <div className={styles.meHeroEditActions}>
                <button className={styles.meHeroEditCancelBtn} onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className={styles.meHeroEditSaveBtn} onClick={handleSave}>
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

const PROJECT_IDEAS = [
  // {
  //   title: "Cashback App",
  //   short: "Pick the best card/UPI app for every payment to maximize cashback.",
  //   full: "You select the apps and cards you use — Axis Bank, HDFC, GPay, PhonePe, credit cards etc. The app tells you which one to use when paying bills, doing recharges, or shopping online, so you never miss a discount or cashback offer.",
  //   accent: "#7a9e7e",
  // },
  {
    title: "Lottery Authenticity",
    short: "Verify if random reward systems (like CRED) are actually fair.",
    full: "Apps like CRED claim 1-in-1000 odds on rewards — but how authentic is that? This tool audits the randomness and fairness of lottery/reward systems, similar to the verification scans banks do, and gives users a transparency score.",
    accent: "#8a9e7a",
  },
  {
    title: "Regex Generator for VSCode",
    short: "Describe what to search in plain English, get a regex for VSCode.",
    full: "A free local AI model that lives in VSCode. You tell it what you're looking for in plain English and it generates the right regex for the search bar. Can also do simple utility tasks like find-and-replace patterns across the codebase.",
    accent: "#9e8a7a",
  },
  {
    title: "Smart Bookmark Manager",
    short: "Chrome/Firefox extension that uses AI to organize browsing history.",
    full: "AI categorizes every page you visit (work, research, entertainment). Search past history using natural language. Auto-bookmarks important pages based on your behavior. Syncs across devices. Freemium model — basic free, advanced AI organization paid.",
    accent: "#7a8a9e",
  },
  {
    title: "Website Legitimacy Checker",
    short: "Chrome extension that flags scam sites before you enter card details.",
    full: "Any website can ask for your card info — this extension verifies legitimacy by checking against known safe payment auth providers and inspecting web requests in real time to detect if sensitive data like CVV is being sent in plaintext.",
    accent: "#9e7a8a",
  },
];

type TooltipState = { title: string; full: string; x: number; y: number } | null;

function ProjectIdeasCard() {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  function showTooltip(e: React.MouseEvent, idea: typeof PROJECT_IDEAS[0]) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    setTooltip({
      title: idea.title,
      full: idea.full,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  }

  return (
    <Card className={styles.projectIdeasCard}>
      <div className={styles.noteCardHeader}>
        <div className={styles.noteCardTitle}>
          <span className={styles.noteCardTitleIcon}>
            <Lightbulb size={15} />
          </span>
          <span>Things I plan to work on</span>
        </div>
      </div>
      <div className={styles.projectIdeasGrid}>
        {PROJECT_IDEAS.map((idea) => (
          <div
            key={idea.title}
            className={styles.stickyNote}
            style={{ "--idea-accent": idea.accent } as React.CSSProperties}
            onMouseEnter={(e) => showTooltip(e, idea)}
            onMouseLeave={() => setTooltip(null)}
          >
            <span className={styles.stickyNoteTitle}>{idea.title}</span>
            <p className={styles.stickyNoteDesc}>{idea.short}</p>
          </div>
        ))}
        <button className={styles.stickyNoteSuggest}>
          <Plus size={14} />
          <span>Suggest an idea</span>
        </button>
      </div>

      {tooltip && createPortal(
        <div
          className={styles.ideaTooltip}
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          <span className={styles.ideaTooltipTitle}>{tooltip.title}</span>
          <p className={styles.ideaTooltipBody}>{tooltip.full}</p>
        </div>,
        document.body
      )}
    </Card>
  );
}

function PlayGameCard() {
  const { openGame } = useGame();
  return (
    <Card className={styles.playGameCard}>
      <div className={styles.playGameLeft}>
        <Gamepad2 size={22} className={styles.playGameIcon} />
        <h3 className={styles.playGameTitle}>Arcade Room</h3>
        <p className={styles.playGameSub}>
          Step into the playground for a quick arcade break. Launch a game,
          clear your head, and chase a new high score.
        </p>
        <Button
          label="Open Playground"
          icon={Play}
          variant="secondary"
          onClick={openGame}
        />
      </div>
      <div className={styles.playGamePoster}>
        <div className={styles.playGamePosterGlow} />
        <div className={styles.playGamePosterCabinet}>
          <div className={styles.playGamePosterPad}>
            <div className={styles.playGamePosterDpad}>
              <span />
              <span />
              <span />
              <span />
            </div>
            <div className={styles.playGamePosterCenter}>
              <Gamepad2 size={18} />
            </div>
            <div className={styles.playGamePosterButtons}>
              <span />
              <span />
              <span />
              <span />
            </div>
          </div>
          <div className={styles.playGamePosterBase} />
        </div>
        <div className={styles.playGamePosterLights} />
      </div>
    </Card>
  );
}

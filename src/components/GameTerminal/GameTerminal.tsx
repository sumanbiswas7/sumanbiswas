"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import styles from "./GameTerminal.module.scss";

type GameView = "library" | "reaction";
type ReactionState = "idle" | "waiting" | "ready" | "result" | "toosoon";

const LS_BEST   = "reaction_best";
const LS_SCORES = "reaction_scores";
const MAX_SCORES = 5;

function readBest(): number | null {
  try {
    const v = localStorage.getItem(LS_BEST);
    return v ? parseInt(v, 10) : null;
  } catch { return null; }
}

function readScores(): number[] {
  try {
    return JSON.parse(localStorage.getItem(LS_SCORES) ?? "[]");
  } catch { return []; }
}

export default function GameTerminal() {
  const { isOpen, closeGame } = useGame();
  if (!isOpen) return null;
  return <GameTerminalInner onClose={closeGame} />;
}

function GameTerminalInner({ onClose }: { onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [view, setView] = useState<GameView>("library");
  const [hiScore, setHiScore] = useState<number | null>(null);
  const [scores, setScores]   = useState<number[]>([]);

  // Load from localStorage once on mount (client-only)
  useEffect(() => {
    setHiScore(readBest());
    setScores(readScores());
  }, []);

  function recordScore(t: number) {
    const newBest = hiScore === null ? t : Math.min(hiScore, t);
    setHiScore(newBest);
    localStorage.setItem(LS_BEST, String(newBest));

    const newScores = [t, ...scores].slice(0, MAX_SCORES);
    setScores(newScores);
    localStorage.setItem(LS_SCORES, JSON.stringify(newScores));
  }

  const termRef    = useRef<HTMLDivElement>(null);
  const dragging   = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current || !termRef.current) return;
      termRef.current.style.left = `${startPos.current.x + e.clientX - startMouse.current.x}px`;
      termRef.current.style.top  = `${startPos.current.y + e.clientY - startMouse.current.y}px`;
    }
    function onMouseUp() { dragging.current = false; }
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  const onTitleBarMouseDown = useCallback((e: React.MouseEvent) => {
    if (isFullscreen) return;
    const rect = termRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current   = { x: rect.left, y: rect.top };
    if (termRef.current) {
      termRef.current.style.left      = `${rect.left}px`;
      termRef.current.style.top       = `${rect.top}px`;
      termRef.current.style.transform = "none";
    }
    e.preventDefault();
  }, [isFullscreen]);

  function toggleFullscreen() {
    if (!isFullscreen) {
      const rect = termRef.current?.getBoundingClientRect();
      startPos.current = { x: rect?.left ?? 0, y: rect?.top ?? 0 };
      if (termRef.current) {
        termRef.current.style.left = termRef.current.style.top = termRef.current.style.transform = "";
      }
    } else {
      if (termRef.current && startPos.current.x) {
        termRef.current.style.left      = `${startPos.current.x}px`;
        termRef.current.style.top       = `${startPos.current.y}px`;
        termRef.current.style.transform = "none";
      }
    }
    setIsFullscreen(f => !f);
  }

  return (
    <div
      ref={termRef}
      className={`${styles.terminal} ${isFullscreen ? styles.fullscreen : ""}`}
    >
      <div className={styles.titleBar} onMouseDown={onTitleBarMouseDown}>
        <div className={styles.trafficLights}>
          <button className={`${styles.light} ${styles.red}`} onClick={onClose} aria-label="Close">
            <span className={styles.lightIcon}>×</span>
          </button>
          <button className={`${styles.light} ${styles.yellow}`} onClick={onClose} aria-label="Minimize">
            <span className={styles.lightIcon}>−</span>
          </button>
          <button className={`${styles.light} ${styles.green}`} onClick={toggleFullscreen} aria-label="Fullscreen">
            <span className={styles.lightIcon}>⤢</span>
          </button>
        </div>
        <span className={styles.title}>
          {view === "library" ? "arcade.exe" : "reaction_speed.exe"}
        </span>
        <span className={styles.titleSpacer} />
      </div>

      <div className={styles.body}>
        <div className={styles.scanlines} aria-hidden />
        {view === "library" ? (
          <GameLibrary hiScore={hiScore} onSelect={() => setView("reaction")} />
        ) : (
          <ReactionGame
            hiScore={hiScore}
            scores={scores}
            onScore={recordScore}
            onBack={() => setView("library")}
          />
        )}
      </div>
    </div>
  );
}

function GameLibrary({ hiScore, onSelect }: { hiScore: number | null; onSelect: () => void }) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); onSelect(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelect]);

  const hiDisplay = hiScore !== null
    ? String(hiScore).padStart(6, "0")
    : "------";

  return (
    <div className={styles.library}>
      <div className={styles.libraryTop}>
        <p className={styles.libraryEyebrow}>CREDITS&nbsp;&nbsp;99</p>
        <h2 className={styles.libraryTitle}>
          <span className={styles.tc}>A</span>
          <span className={styles.tp}>R</span>
          <span className={styles.ty}>C</span>
          <span className={styles.tg}>A</span>
          <span className={styles.tc}>D</span>
          <span className={styles.tp}>E</span>
          <span className={styles.ty}>&nbsp;R</span>
          <span className={styles.tg}>O</span>
          <span className={styles.tc}>O</span>
          <span className={styles.tp}>M</span>
        </h2>
        <p className={styles.libraryHiScore}>
          HI&#8209;SCORE&nbsp;&nbsp;<span className={styles.hiScoreVal}>{hiDisplay}</span>
        </p>
      </div>

      <div className={styles.dividerLine} aria-hidden>{"·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·"}</div>

      <div className={styles.gameList}>
        <button className={styles.gameRow} onClick={onSelect}>
          <span className={styles.gameRowCursor}>►</span>
          <div className={styles.gameRowInfo}>
            <span className={styles.gameRowName}>REACTION SPEED TEST</span>
            <span className={styles.gameRowDesc}>HOW FAST ARE YOUR REFLEXES?</span>
          </div>
          <div className={styles.gameRowMeta}>
            <span className={styles.gameRowDiff}>★☆☆</span>
          </div>
        </button>
      </div>

      <div className={styles.dividerLine} aria-hidden>{"·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·  ·"}</div>

      <p className={styles.insertCoin}>▸ PRESS SPACE OR CLICK TO PLAY ◂</p>
    </div>
  );
}

function getRating(ms: number): string {
  if (ms < 150) return "S · SUPERHUMAN";
  if (ms < 200) return "A · ELITE";
  if (ms < 250) return "B · GREAT";
  if (ms < 300) return "C · GOOD";
  if (ms < 400) return "D · AVERAGE";
  return "F · KEEP PRACTICING";
}

function pad(n: number | null, len = 6): string {
  if (n === null) return "──────";
  return String(n).padStart(len, "0");
}

interface ReactionGameProps {
  hiScore: number | null;
  scores: number[];
  onScore: (t: number) => void;
  onBack: () => void;
}

function ReactionGame({ hiScore, scores, onScore, onBack }: ReactionGameProps) {
  const [state, setState]           = useState<ReactionState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord]   = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTime = useRef<number>(0);
  const stateRef  = useRef<ReactionState>("idle");

  stateRef.current = state;

  function start() {
    setState("waiting");
    setIsNewRecord(false);
    const delay = 1500 + Math.random() * 2500;
    timerRef.current = setTimeout(() => {
      setState("ready");
      startTime.current = Date.now();
    }, delay);
  }

  function handleAction() {
    const s = stateRef.current;
    if (s === "idle" || s === "result" || s === "toosoon") { start(); return; }
    if (s === "waiting") {
      if (timerRef.current) clearTimeout(timerRef.current);
      setState("toosoon");
      return;
    }
    if (s === "ready") {
      const t = Date.now() - startTime.current;
      const newRecord = hiScore === null || t < hiScore;
      setReactionTime(t);
      setIsNewRecord(newRecord);
      onScore(t);
      setState("result");
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") { e.preventDefault(); handleAction(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <div className={styles.game}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>SCORE</span>
          <span className={styles.scoreVal}>{pad(reactionTime)}</span>
        </div>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          ◄ BACK
        </button>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>BEST</span>
          <span className={styles.scoreVal}>{pad(hiScore)}</span>
        </div>
      </div>

      <div
        className={`${styles.screen} ${styles[`state_${state}`]}`}
        onClick={handleAction}
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === "Enter" && handleAction()}
        aria-label="Reaction game screen"
      >
        <div className={styles.screenScanlines} aria-hidden />
        <div className={styles.vignette} aria-hidden />

        <div className={styles.screenContent}>
          {state === "idle" && (
            <div className={styles.stateIdle}>
              <div className={styles.idleFrame}>
                <span className={styles.bigLabelA}>PRESS</span>
                <span className={styles.bigLabelB}>START</span>
              </div>
              <span className={styles.blinkHint}>[ SPACE ]  or  [ CLICK ]</span>
            </div>
          )}

          {state === "waiting" && (
            <div className={styles.stateWaiting}>
              <span className={styles.waitLabel}>WAIT FOR IT</span>
              <span className={styles.waitDots}><span>·</span><span>·</span><span>·</span></span>
            </div>
          )}

          {state === "ready" && (
            <div className={styles.stateReady}>
              <span className={styles.goLabel}>GO!</span>
            </div>
          )}

          {state === "result" && reactionTime !== null && (
            <div className={styles.stateResult}>
              {isNewRecord && <span className={styles.newRecord}>▲ NEW RECORD</span>}
              <span className={styles.resultTime}>
                {reactionTime}<span className={styles.resultUnit}>ms</span>
              </span>
              <span className={styles.resultRating}>{getRating(reactionTime)}</span>
              {scores.length > 1 && (
                <div className={styles.scoreHistory}>
                  {scores.slice(1).map((s, i) => (
                    <span key={i} className={styles.scoreHistoryItem}>{s}ms</span>
                  ))}
                </div>
              )}
              <span className={styles.retryHint}>SPACE or CLICK to retry</span>
            </div>
          )}

          {state === "toosoon" && (
            <div className={styles.stateFoul}>
              <span className={styles.foulLabel}>FOUL!</span>
              <span className={styles.foulSub}>TOO EARLY — WAIT FOR GREEN</span>
              <span className={styles.retryHint}>SPACE or CLICK to retry</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

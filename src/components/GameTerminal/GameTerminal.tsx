"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useGame } from "@/context/GameContext";
import styles from "./GameTerminal.module.scss";

type GameView = "library" | "reaction" | "aim" | "mole" | "car";
type ReactionState = "idle" | "waiting" | "ready" | "result" | "toosoon";
type AimState  = "idle" | "playing" | "result";
type MoleState = "idle" | "playing" | "result";

interface AimTarget {
  id: number;
  x: number;
  y: number;
  size: number;
}

const LS_BEST       = "reaction_best";
const LS_SCORES     = "reaction_scores";
const AIM_BEST_KEY  = "aim_best";
const MOLE_BEST_KEY = "mole_best";
const MAX_SCORES    = 5;
const TARGET_COUNT  = 3;
const GAME_DURATION = 30;

const HOLE_COUNT    = 12;
const MAX_ACTIVE    = 3;
const MOLE_VISIBLE  = 850;
const SPAWN_MS      = 500;
const HOLE_KEYS     = ["1","2","3","4","q","w","e","r","a","s","d","f"];

const CAR_BEST_KEY  = "car_best";
const CANVAS_W      = 660;
const CANVAS_H      = 310;
const LANE_COUNT    = 3;
const LANE_W        = CANVAS_W / LANE_COUNT;
const CAR_W         = 46;
const CAR_H         = 76;
const PLAYER_BOTTOM = 28;

function readBest(): number | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(LS_BEST); return v ? parseInt(v, 10) : null; }
  catch { return null; }
}
function readScores(): number[] {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(LS_SCORES) ?? "[]"); }
  catch { return []; }
}
function readAimBest(): number | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(AIM_BEST_KEY); return v ? parseInt(v, 10) : null; }
  catch { return null; }
}
function readMoleBest(): number | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(MOLE_BEST_KEY); return v ? parseInt(v, 10) : null; }
  catch { return null; }
}
function readCarBest(): number | null {
  if (typeof window === "undefined") return null;
  try { const v = localStorage.getItem(CAR_BEST_KEY); return v ? parseInt(v, 10) : null; }
  catch { return null; }
}

export default function GameTerminal() {
  const { isOpen, closeGame } = useGame();
  if (!isOpen) return null;
  return <GameTerminalInner onClose={closeGame} />;
}

function GameTerminalInner({ onClose }: { onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [view, setView]     = useState<GameView>("library");
  const [hiScore, setHiScore] = useState<number | null>(readBest);
  const [scores, setScores]   = useState<number[]>(readScores);
  const [aimBest, setAimBest]   = useState<number | null>(readAimBest);
  const [moleBest, setMoleBest] = useState<number | null>(readMoleBest);
  const [carBest,  setCarBest]  = useState<number | null>(readCarBest);

  function recordScore(t: number) {
    setHiScore((prev) => {
      const nextBest = prev === null ? t : Math.min(prev, t);
      localStorage.setItem(LS_BEST, String(nextBest));
      return nextBest;
    });

    setScores((prev) => {
      const nextScores = [t, ...prev].slice(0, MAX_SCORES);
      localStorage.setItem(LS_SCORES, JSON.stringify(nextScores));
      return nextScores;
    });
  }

  function recordAimScore(s: number) {
    const newBest = aimBest === null ? s : Math.max(aimBest, s);
    setAimBest(newBest);
    localStorage.setItem(AIM_BEST_KEY, String(newBest));
  }

  function recordMoleScore(s: number) {
    const newBest = moleBest === null ? s : Math.max(moleBest, s);
    setMoleBest(newBest);
    localStorage.setItem(MOLE_BEST_KEY, String(newBest));
  }

  function recordCarScore(s: number) {
    const newBest = carBest === null ? s : Math.max(carBest, s);
    setCarBest(newBest);
    localStorage.setItem(CAR_BEST_KEY, String(newBest));
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

  const titleMap: Record<GameView, string> = {
    library:  "arcade.exe",
    reaction: "reaction_speed.exe",
    aim:      "aim_trainer.exe",
    mole:     "whack_a_mole.exe",
    car:      "dodge_traffic.exe",
  };

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
        <span className={styles.title}>{titleMap[view]}</span>
        <span className={styles.titleSpacer} />
      </div>

      <div className={styles.body}>
        <div className={styles.scanlines} aria-hidden />
        {view === "library" ? (
          <GameLibrary
            hiScore={hiScore}
            aimBest={aimBest}
            moleBest={moleBest}
            carBest={carBest}
            onSelectReaction={() => setView("reaction")}
            onSelectAim={() => setView("aim")}
            onSelectMole={() => setView("mole")}
            onSelectCar={() => setView("car")}
          />
        ) : view === "reaction" ? (
          <ReactionGame
            hiScore={hiScore}
            scores={scores}
            onScore={recordScore}
            onBack={() => setView("library")}
          />
        ) : view === "aim" ? (
          <AimGame
            aimBest={aimBest}
            onScore={recordAimScore}
            onBack={() => setView("library")}
          />
        ) : view === "mole" ? (
          <MoleGame
            moleBest={moleBest}
            onScore={recordMoleScore}
            onBack={() => setView("library")}
          />
        ) : (
          <CarGame
            carBest={carBest}
            onScore={recordCarScore}
            onBack={() => setView("library")}
          />
        )}
      </div>
    </div>
  );
}

interface GameLibraryProps {
  hiScore: number | null;
  aimBest: number | null;
  moleBest: number | null;
  carBest: number | null;
  onSelectReaction: () => void;
  onSelectAim: () => void;
  onSelectMole: () => void;
  onSelectCar: () => void;
}

function GameLibrary({ hiScore, aimBest, moleBest, carBest, onSelectReaction, onSelectAim, onSelectMole, onSelectCar }: GameLibraryProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); onSelectReaction(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onSelectReaction]);

  const hiDisplay   = hiScore  !== null ? String(hiScore).padStart(6, "0")  : "------";
  const aimDisplay  = aimBest  !== null ? String(aimBest).padStart(3, "0")  : "---";
  const moleDisplay = moleBest !== null ? String(moleBest).padStart(3, "0") : "---";
  const carDisplay  = carBest  !== null ? String(carBest).padStart(5, "0")  : "-----";

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
        <button className={styles.gameRow} onClick={onSelectReaction}>
          <span className={styles.gameRowCursor}>►</span>
          <div className={styles.gameRowInfo}>
            <span className={styles.gameRowName}>REACTION SPEED TEST</span>
            <span className={styles.gameRowDesc}>HOW FAST ARE YOUR REFLEXES?</span>
          </div>
          <div className={styles.gameRowMeta}>
            <span className={styles.gameRowDiff}>★☆☆</span>
            {hiScore !== null && (
              <span className={styles.gameRowBest}>{hiDisplay}</span>
            )}
          </div>
        </button>
        <button className={styles.gameRow} onClick={onSelectAim}>
          <span className={styles.gameRowCursor}>►</span>
          <div className={styles.gameRowInfo}>
            <span className={styles.gameRowName}>AIM TRAINER</span>
            <span className={styles.gameRowDesc}>HIT AS MANY TARGETS AS YOU CAN IN 30S</span>
          </div>
          <div className={styles.gameRowMeta}>
            <span className={styles.gameRowDiff}>★★☆</span>
            {aimBest !== null && (
              <span className={styles.gameRowBest}>{aimDisplay}</span>
            )}
          </div>
        </button>
        <button className={styles.gameRow} onClick={onSelectMole}>
          <span className={styles.gameRowCursor}>►</span>
          <div className={styles.gameRowInfo}>
            <span className={styles.gameRowName}>WHACK-A-MOLE</span>
            <span className={styles.gameRowDesc}>SMASH MOLES BEFORE THEY VANISH — 30S</span>
          </div>
          <div className={styles.gameRowMeta}>
            <span className={styles.gameRowDiff}>★★☆</span>
            {moleBest !== null && (
              <span className={styles.gameRowBest}>{moleDisplay}</span>
            )}
          </div>
        </button>
        <button className={styles.gameRow} onClick={onSelectCar}>
          <span className={styles.gameRowCursor}>►</span>
          <div className={styles.gameRowInfo}>
            <span className={styles.gameRowName}>DODGE TRAFFIC</span>
            <span className={styles.gameRowDesc}>SURVIVE AS LONG AS YOU CAN</span>
          </div>
          <div className={styles.gameRowMeta}>
            <span className={styles.gameRowDiff}>★★★</span>
            {carBest !== null && (
              <span className={styles.gameRowBest}>{carDisplay}</span>
            )}
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

function getAimRating(hits: number): string {
  if (hits >= 40) return "S · INHUMAN";
  if (hits >= 30) return "A · ELITE";
  if (hits >= 22) return "B · SHARP";
  if (hits >= 15) return "C · DECENT";
  if (hits >= 8)  return "D · AVERAGE";
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
  const [state, setState]               = useState<ReactionState>("idle");
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [isNewRecord, setIsNewRecord]   = useState(false);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTime = useRef<number>(0);
  const stateRef  = useRef<ReactionState>("idle");

  useEffect(() => { stateRef.current = state; });

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

function AimGame({
  aimBest,
  onScore,
  onBack,
}: {
  aimBest: number | null;
  onScore: (s: number) => void;
  onBack: () => void;
}) {
  const [aimState, setAimState]   = useState<AimState>("idle");
  const [score, setScore]         = useState(0);
  const [timeLeft, setTimeLeft]   = useState(GAME_DURATION);
  const [targets, setTargets]     = useState<AimTarget[]>([]);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const scoreRef  = useRef(0);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const idRef     = useRef(0);
  const aimBestRef = useRef(aimBest);

  useEffect(() => { aimBestRef.current = aimBest; }, [aimBest]);

  function spawnTarget(): AimTarget {
    const size = 28 + Math.floor(Math.random() * 26); // 28–54 px
    return {
      id:   idRef.current++,
      x:    8  + Math.random() * 74,
      y:    10 + Math.random() * 70,
      size,
    };
  }

  function startGame() {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsNewRecord(false);
    setTargets(Array.from({ length: TARGET_COUNT }, spawnTarget));
    setAimState("playing");
  }

  // Tick the timer while playing
  useEffect(() => {
    if (aimState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [aimState]);

  // End game when timer hits 0
  useEffect(() => {
    if (aimState !== "playing" || timeLeft > 0) return;
    const s = scoreRef.current;
    const newRecord = aimBestRef.current === null || s > aimBestRef.current;
    setIsNewRecord(newRecord);
    onScore(s);
    setAimState("result");
  }, [timeLeft, aimState]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => { if (timerRef.current) clearInterval(timerRef.current); }, []);

  function hitTarget(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    if (aimState !== "playing") return;
    scoreRef.current += 1;
    setScore(scoreRef.current);
    setTargets(prev => [...prev.filter(t => t.id !== id), spawnTarget()]);
  }

  const isInteractive = aimState === "idle" || aimState === "result";

  return (
    <div className={styles.game}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>HITS</span>
          <span className={styles.scoreVal}>{String(score).padStart(3, "0")}</span>
        </div>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">
          ◄ BACK
        </button>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>TIME</span>
          <span className={`${styles.scoreVal} ${timeLeft <= 5 && aimState === "playing" ? styles.scoreValDanger : ""}`}>
            {String(timeLeft).padStart(2, "0")}s
          </span>
        </div>
      </div>

      <div
        className={styles.aimScreen}
        onClick={isInteractive ? startGame : undefined}
        style={{ cursor: isInteractive ? "pointer" : "crosshair" }}
      >
        <div className={styles.screenScanlines} aria-hidden />
        <div className={styles.vignette} aria-hidden />

        {aimState === "idle" && (
          <div className={styles.screenContent}>
            <div className={styles.stateIdle}>
              <div className={styles.idleFrame}>
                <span className={styles.bigLabelA}>AIM</span>
                <span className={styles.bigLabelB}>TRAINER</span>
              </div>
              <span className={styles.blinkHint}>[ CLICK ] to start</span>
            </div>
          </div>
        )}

        {aimState === "playing" && (
          <div className={styles.aimPlayArea}>
            {targets.map(t => (
              <button
                key={t.id}
                className={styles.aimTarget}
                style={{ left: `${t.x}%`, top: `${t.y}%`, width: t.size, height: t.size }}
                onClick={e => hitTarget(e, t.id)}
                aria-label="Target"
              />
            ))}
          </div>
        )}

        {aimState === "result" && (
          <div className={styles.screenContent}>
            <div className={styles.stateResult}>
              {isNewRecord && <span className={styles.newRecord}>▲ NEW RECORD</span>}
              <span className={styles.resultTime}>
                {score}<span className={styles.resultUnit}>hits</span>
              </span>
              <span className={styles.resultRating}>{getAimRating(score)}</span>
              {aimBest !== null && (
                <span className={styles.scoreHistoryItem} style={{ marginTop: "0.25rem" }}>
                  BEST&nbsp;&nbsp;{aimBest}
                </span>
              )}
              <span className={styles.retryHint}>CLICK to play again</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getMoleRating(hits: number): string {
  if (hits >= 35) return "S · MOLE DESTROYER";
  if (hits >= 25) return "A · ELITE WHACKER";
  if (hits >= 18) return "B · SHARP REFLEXES";
  if (hits >= 12) return "C · DECENT";
  if (hits >= 6)  return "D · SLOW POKE";
  return "F · THE MOLES WIN";
}

function MoleGame({
  moleBest,
  onScore,
  onBack,
}: {
  moleBest: number | null;
  onScore: (s: number) => void;
  onBack: () => void;
}) {
  const [moleState, setMoleState]     = useState<MoleState>("idle");
  const [score, setScore]             = useState(0);
  const [timeLeft, setTimeLeft]       = useState(GAME_DURATION);
  const [activeHoles, setActiveHoles] = useState<Set<number>>(new Set());
  const [whackedHoles, setWhackedHoles] = useState<Set<number>>(new Set());
  const [isNewRecord, setIsNewRecord] = useState(false);

  const scoreRef    = useRef(0);
  const timerRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const spawnRef    = useRef<ReturnType<typeof setInterval> | null>(null);
  const activeRef   = useRef<Set<number>>(new Set());
  const moleBestRef = useRef(moleBest);

  useEffect(() => { moleBestRef.current = moleBest; }, [moleBest]);

  const whackHole = useCallback((id: number) => {
    if (!activeRef.current.has(id)) return;
    setActiveHoles(prev => {
      const next = new Set(prev);
      next.delete(id);
      activeRef.current = next;
      return next;
    });
    setWhackedHoles(prev => new Set([...prev, id]));
    setTimeout(() => {
      setWhackedHoles(prev => { const n = new Set(prev); n.delete(id); return n; });
    }, 220);
    scoreRef.current += 1;
    setScore(scoreRef.current);
  }, []);

  function activateMole(id: number) {
    setActiveHoles(prev => {
      const next = new Set(prev);
      next.add(id);
      activeRef.current = next;
      return next;
    });
    const visibleMs = MOLE_VISIBLE + Math.random() * 200;
    setTimeout(() => {
      setActiveHoles(prev => {
        if (!prev.has(id)) return prev;
        const next = new Set(prev);
        next.delete(id);
        activeRef.current = next;
        return next;
      });
    }, visibleMs);
  }

  function startGame() {
    scoreRef.current = 0;
    setScore(0);
    setTimeLeft(GAME_DURATION);
    setIsNewRecord(false);
    setActiveHoles(new Set());
    setWhackedHoles(new Set());
    activeRef.current = new Set();
    setMoleState("playing");
  }

  // Countdown timer
  useEffect(() => {
    if (moleState !== "playing") return;
    timerRef.current = setInterval(() => {
      setTimeLeft(t => Math.max(0, t - 1));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [moleState]);

  // Mole spawner
  useEffect(() => {
    if (moleState !== "playing") return;
    spawnRef.current = setInterval(() => {
      if (activeRef.current.size >= MAX_ACTIVE) return;
      const inactive = Array.from({ length: HOLE_COUNT }, (_, i) => i)
        .filter(i => !activeRef.current.has(i));
      if (inactive.length === 0) return;
      activateMole(inactive[Math.floor(Math.random() * inactive.length)]);
    }, SPAWN_MS);
    return () => { if (spawnRef.current) clearInterval(spawnRef.current); };
  }, [moleState]);

  // End game when timer hits 0
  useEffect(() => {
    if (moleState !== "playing" || timeLeft > 0) return;
    const s = scoreRef.current;
    const newRecord = moleBestRef.current === null || s > moleBestRef.current;
    setIsNewRecord(newRecord);
    onScore(s);
    setMoleState("result");
  }, [timeLeft, moleState]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard controls
  useEffect(() => {
    if (moleState !== "playing") return;
    function onKey(e: KeyboardEvent) {
      const idx = HOLE_KEYS.indexOf(e.key.toLowerCase());
      if (idx === -1) return;
      e.preventDefault();
      whackHole(idx);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moleState, whackHole]);

  // Cleanup on unmount
  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnRef.current) clearInterval(spawnRef.current);
  }, []);

  const isInteractive = moleState === "idle" || moleState === "result";

  return (
    <div className={styles.game}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>HITS</span>
          <span className={styles.scoreVal}>{String(score).padStart(3, "0")}</span>
        </div>
        <button className={styles.backBtn} onClick={onBack} aria-label="Back">◄ BACK</button>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>TIME</span>
          <span className={`${styles.scoreVal} ${timeLeft <= 5 && moleState === "playing" ? styles.scoreValDanger : ""}`}>
            {String(timeLeft).padStart(2, "0")}s
          </span>
        </div>
      </div>

      <div
        className={styles.moleScreen}
        onClick={isInteractive ? startGame : undefined}
        style={{ cursor: isInteractive ? "pointer" : "default" }}
      >
        <div className={styles.screenScanlines} aria-hidden />
        <div className={styles.vignette} aria-hidden />

        {moleState === "idle" && (
          <div className={styles.screenContent}>
            <div className={styles.stateIdle}>
              <div className={styles.idleFrame}>
                <span className={styles.bigLabelA}>WHACK</span>
                <span className={styles.bigLabelB}>A MOLE</span>
              </div>
              <span className={styles.blinkHint}>[ CLICK ] or [ KEY ] to start</span>
            </div>
          </div>
        )}

        {moleState === "playing" && (
          <div className={styles.moleGrid}>
            {Array.from({ length: HOLE_COUNT }, (_, i) => {
              const isActive  = activeHoles.has(i);
              const isWhacked = whackedHoles.has(i);
              return (
                <button
                  key={i}
                  className={`${styles.moleHole} ${isActive ? styles.moleHoleActive : ""}`}
                  onClick={isActive ? e => { e.stopPropagation(); whackHole(i); } : undefined}
                  aria-label={`Hole ${i + 1}`}
                >
                  {(isActive || isWhacked) && (
                    <div className={`${styles.mole} ${isWhacked ? styles.moleWhacked : styles.moleUp}`} />
                  )}
                  <span className={styles.holeKey}>{HOLE_KEYS[i].toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        )}

        {moleState === "result" && (
          <div className={styles.screenContent}>
            <div className={styles.stateResult}>
              {isNewRecord && <span className={styles.newRecord}>▲ NEW RECORD</span>}
              <span className={styles.resultTime}>
                {score}<span className={styles.resultUnit}>hits</span>
              </span>
              <span className={styles.resultRating}>{getMoleRating(score)}</span>
              {moleBest !== null && (
                <span className={styles.scoreHistoryItem} style={{ marginTop: "0.25rem" }}>
                  BEST&nbsp;&nbsp;{moleBest}
                </span>
              )}
              <span className={styles.retryHint}>CLICK to play again</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Car game ─────────────────────────────────────────────────────────────────

function getCarRating(score: number): string {
  if (score >= 300) return "S · ROAD LEGEND";
  if (score >= 180) return "A · ELITE DRIVER";
  if (score >= 100) return "B · SOLID WHEELS";
  if (score >= 50)  return "C · GETTING THERE";
  if (score >= 15)  return "D · FENDER BENDER";
  return "F · INSTANT CRASH";
}

function laneX(lane: number): number {
  return lane * LANE_W + LANE_W / 2 - CAR_W / 2;
}

function cRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPlayerCar(ctx: CanvasRenderingContext2D, x: number, y: number, dead: boolean) {
  const color = dead ? "#ff1a3d" : "#00ff55";
  ctx.shadowColor = color; ctx.shadowBlur = 18;
  ctx.fillStyle = color;
  cRoundRect(ctx, x, y, CAR_W, CAR_H, 6); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(0,25,10,0.8)";
  cRoundRect(ctx, x + 7, y + 10, CAR_W - 14, 20, 2); ctx.fill();
  ctx.fillStyle = dead ? "#ff6b6b" : "#ffffff";
  ctx.fillRect(x + 5,          y + CAR_H - 10, 10, 6);
  ctx.fillRect(x + CAR_W - 15, y + CAR_H - 10, 10, 6);
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.fillRect(x + CAR_W / 2 - 1, y + 34, 2, CAR_H - 44);
}

const TRAFFIC_COLORS = ["#ffd500", "#ff6b35", "#c084fc", "#38bdf8"];

function drawTrafficCar(ctx: CanvasRenderingContext2D, x: number, y: number, colorIdx: number) {
  const color = TRAFFIC_COLORS[colorIdx % TRAFFIC_COLORS.length];
  ctx.shadowColor = color; ctx.shadowBlur = 10;
  ctx.fillStyle = color;
  cRoundRect(ctx, x, y, CAR_W, CAR_H, 6); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.fillStyle = "rgba(20,14,0,0.75)";
  cRoundRect(ctx, x + 7, y + CAR_H - 30, CAR_W - 14, 20, 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.9)";
  ctx.fillRect(x + 5,          y + 4, 10, 6);
  ctx.fillRect(x + CAR_W - 15, y + 4, 10, 6);
}

interface CarGS {
  status: "idle" | "playing" | "dead";
  playerLane: number;
  playerX: number;
  cars: { id: number; lane: number; y: number; colorIdx: number }[];
  score: number;
  frame: number;
  speed: number;
  spawnCooldown: number;
}

function drawScene(ctx: CanvasRenderingContext2D, gs: CarGS) {
  ctx.fillStyle = "#060d06"; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  ctx.strokeStyle = "#1a3822"; ctx.lineWidth = 2;
  ctx.setLineDash([24, 18]);
  ctx.lineDashOffset = -((gs.frame * gs.speed) % 42);
  for (let i = 1; i < LANE_COUNT; i++) {
    ctx.beginPath(); ctx.moveTo(i * LANE_W, 0); ctx.lineTo(i * LANE_W, CANVAS_H); ctx.stroke();
  }
  ctx.setLineDash([]); ctx.lineDashOffset = 0;
  ctx.strokeStyle = "#256635"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(1, 0); ctx.lineTo(1, CANVAS_H); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(CANVAS_W - 1, 0); ctx.lineTo(CANVAS_W - 1, CANVAS_H); ctx.stroke();
  for (const c of gs.cars) drawTrafficCar(ctx, laneX(c.lane), c.y, c.colorIdx);
  drawPlayerCar(ctx, gs.playerX, CANVAS_H - CAR_H - PLAYER_BOTTOM, gs.status === "dead");
  if (gs.status === "playing") {
    ctx.font = "bold 11px monospace";
    ctx.textAlign = "right"; ctx.fillStyle = "#3aaa52";
    ctx.fillText(String(gs.score).padStart(5, "0"), CANVAS_W - 12, 18);
    ctx.textAlign = "left"; ctx.fillStyle = "#256635";
    ctx.fillText(`SPD ${gs.speed.toFixed(1)}`, 12, 18);
  }
}

function CarGame({
  carBest, onScore, onBack,
}: { carBest: number | null; onScore: (s: number) => void; onBack: () => void }) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const rafRef     = useRef<number>(0);
  const carBestRef = useRef(carBest);
  useEffect(() => { carBestRef.current = carBest; }, [carBest]);

  const [status, setStatus]           = useState<"idle" | "playing" | "dead">("idle");
  const [score, setScore]             = useState(0);
  const [isNewRecord, setIsNewRecord] = useState(false);

  const gs = useRef<CarGS>({
    status: "idle", playerLane: 1, playerX: laneX(1),
    cars: [], score: 0, frame: 0, speed: 3, spawnCooldown: 60,
  });

  const startGame = useCallback(() => {
    const g = gs.current;
    g.status = "playing"; g.playerLane = 1; g.playerX = laneX(1);
    g.cars = []; g.score = 0; g.frame = 0; g.speed = 3; g.spawnCooldown = 60;
    setStatus("playing"); setScore(0); setIsNewRecord(false);
  }, []);

  const moveLeft  = useCallback(() => {
    if (gs.current.status !== "playing") return;
    gs.current.playerLane = Math.max(0, gs.current.playerLane - 1);
  }, []);

  const moveRight = useCallback(() => {
    if (gs.current.status !== "playing") return;
    gs.current.playerLane = Math.min(LANE_COUNT - 1, gs.current.playerLane + 1);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "ArrowLeft"  || e.key === "a" || e.key === "A") { e.preventDefault(); moveLeft(); }
      if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") { e.preventDefault(); moveRight(); }
      if ((e.key === " " || e.key === "Enter") && gs.current.status !== "playing") {
        e.preventDefault(); startGame();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moveLeft, moveRight, startGame]);

  useEffect(() => {
    let colorCounter = 0;
    function loop() {
      const canvas = canvasRef.current;
      if (!canvas) { rafRef.current = requestAnimationFrame(loop); return; }
      const ctx = canvas.getContext("2d")!;
      const g   = gs.current;

      if (g.status === "playing") {
        g.frame++;
        g.speed  = 3 + Math.floor(g.frame / 240) * 0.7;
        g.score  = Math.floor(g.frame / 3);
        g.playerX += (laneX(g.playerLane) - g.playerX) * 0.22;
        g.cars = g.cars.map(c => ({ ...c, y: c.y + g.speed })).filter(c => c.y < CANVAS_H + CAR_H);

        g.spawnCooldown--;
        if (g.spawnCooldown <= 0) {
          const interval = Math.max(18, 60 - Math.floor(g.frame / 300) * 8);
          g.spawnCooldown = interval + Math.floor(Math.random() * 20);
          const free = [0, 1, 2].filter(l => !g.cars.some(c => c.lane === l && c.y < CAR_H + 10));
          if (free.length) {
            const lane = free[Math.floor(Math.random() * free.length)];
            g.cars.push({ id: g.frame, lane, y: -CAR_H, colorIdx: colorCounter++ });
          }
        }

        const py = CANVAS_H - CAR_H - PLAYER_BOTTOM;
        for (const c of g.cars) {
          const cx = laneX(c.lane) + CAR_W / 2;
          const px = g.playerX     + CAR_W / 2;
          if (Math.abs(cx - px) < CAR_W * 0.82 && c.y + CAR_H > py && c.y < py + CAR_H) {
            g.status = "dead";
            const s  = g.score;
            const nr = carBestRef.current === null || s > carBestRef.current;
            setIsNewRecord(nr); onScore(s); setScore(s); setStatus("dead");
            break;
          }
        }
      }

      drawScene(ctx, g);
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={styles.game}>
      <div className={styles.scoreBoard}>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>SCORE</span>
          <span className={styles.scoreVal}>{String(score).padStart(5, "0")}</span>
        </div>
        <button className={styles.backBtn} onClick={onBack}>◄ BACK</button>
        <div className={styles.scoreGroup}>
          <span className={styles.scoreLabel}>BEST</span>
          <span className={styles.scoreVal}>
            {carBest !== null ? String(carBest).padStart(5, "0") : "-----"}
          </span>
        </div>
      </div>

      <div className={styles.carScreen}>
        <canvas ref={canvasRef} width={CANVAS_W} height={CANVAS_H} className={styles.carCanvas} />
        {status !== "playing" && (
          <div className={styles.carOverlay} onClick={startGame}>
            {status === "idle" ? (
              <div className={styles.stateIdle}>
                <div className={styles.idleFrame}>
                  <span className={styles.bigLabelA}>DODGE</span>
                  <span className={styles.bigLabelB}>TRAFFIC</span>
                </div>
                <span className={styles.blinkHint}>[ A / ◄ ] &nbsp;&nbsp; [ D / ► ] to steer</span>
              </div>
            ) : (
              <div className={styles.stateResult}>
                {isNewRecord && <span className={styles.newRecord}>▲ NEW RECORD</span>}
                <span className={styles.resultTime}>
                  {score}<span className={styles.resultUnit}>pts</span>
                </span>
                <span className={styles.resultRating}>{getCarRating(score)}</span>
                {carBest !== null && (
                  <span className={styles.scoreHistoryItem} style={{ marginTop: "0.25rem" }}>
                    BEST&nbsp;&nbsp;{carBest}
                  </span>
                )}
                <span className={styles.retryHint}>CLICK or SPACE to retry</span>
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.carControls}>
        <button className={styles.carControlBtn} onPointerDown={moveLeft}>◄ LEFT</button>
        <span className={styles.carControlHint}>A / ← &nbsp;&nbsp;&nbsp; D / →</span>
        <button className={styles.carControlBtn} onPointerDown={moveRight}>RIGHT ►</button>
      </div>
    </div>
  );
}

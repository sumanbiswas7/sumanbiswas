"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useEli } from "@/context/EliContext";
import styles from "./EliTerminal.module.scss";

// ─── Pixel letter maps (5 cols × 7 rows) ─────────────────────────────────────

const LETTER_E = [
  [1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1],
];
const LETTER_L = [
  [1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1],
];
const LETTER_I = [
  [1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[1,1,1,1,1],
];

function PixelLetter({ map }: { map: number[][] }) {
  return (
    <div className={styles.pixelLetter}>
      {map.map((row, r) =>
        row.map((cell, c) => (
          <div key={`${r}-${c}`} className={`${styles.pixel} ${cell ? styles.pixelOn : styles.pixelOff}`} />
        ))
      )}
    </div>
  );
}

// ─── Commands ─────────────────────────────────────────────────────────────────

const ALL_COMMANDS = [
  { cmd: "/help",     desc: "List all commands" },
  { cmd: "/who",      desc: "About Suman" },
  { cmd: "/contact",  desc: "Jump to contact section" },
  { cmd: "/projects", desc: "Browse projects" },
  { cmd: "/skills",   desc: "View tech stack" },
  { cmd: "/email",    desc: "Copy email to clipboard" },
  { cmd: "/github",   desc: "Open GitHub profile" },
  { cmd: "/connect",  desc: "Open LinkedIn profile" },
  { cmd: "/twitter",  desc: "Open Twitter / X profile" },
  { cmd: "/clear",    desc: "Clear terminal" },
];

const PANEL_COMMANDS = ["/help", "/email", "/github", "/connect", "/contact"];
const SUMAN_EMAIL = "textsumanb@gmail.com";

type Message = { id: number; role: "user" | "eli"; lines: string[] };
type SpecialResult = "__CONTACT__" | "__EMAIL__" | "__GITHUB__" | "__CONNECT__" | "__TWITTER__" | "__CLEAR__";

function getResponse(cmd: string): string[] | SpecialResult {
  const c = cmd.trim().toLowerCase();
  if (c === "/help") return [
    "Available commands:",
    "  /who      — About Suman",
    "  /contact  — Jump to contact section",
    "  /projects — Browse all projects",
    "  /skills   — View tech stack",
    "  /email    — Copy email to clipboard",
    "  /github   — Open GitHub profile",
    "  /connect  — Open LinkedIn profile",
    "  /twitter  — Open Twitter / X profile",
    "  /clear    — Clear terminal",
  ];
  if (c === "/who") return [
    "Suman Biswas — FullStack Engineer.",
    "Builds products end-to-end: React, Next.js,",
    "Node.js, React Native, Postgres, AWS, and more.",
    "Based in India. Open to interesting work.",
  ];
  if (c === "/contact")  return "__CONTACT__";
  if (c === "/email")    return "__EMAIL__";
  if (c === "/github")   return "__GITHUB__";
  if (c === "/connect")  return "__CONNECT__";
  if (c === "/twitter")  return "__TWITTER__";
  if (c === "/clear")    return "__CLEAR__";
  if (c === "/projects") return [
    "Projects:",
    "  → Marked       — Link & task management app",
    "  → Signinlink   — Digital sign-in for businesses",
    "  → Poshkit      — React component library (NPM)",
    "  → Cinematic    — Movie discovery platform",
    "  → Vivid        — Social media mobile app",
  ];
  if (c === "/skills") return [
    "Tech stack:",
    "  Frontend  — React, Next.js, React Native, SCSS",
    "  Backend   — Node.js, Express, GraphQL",
    "  Infra     — AWS, Postgres, Turborepo, Docker",
    "  Tools     — Git, Storybook, Rollup, NPM",
  ];
  return [`Unknown command: '${cmd}'`, "Type /help to see available commands."];
}

// ─── Inner terminal ───────────────────────────────────────────────────────────

function EliTerminalInner({ onClose }: { onClose: () => void }) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const termRef    = useRef<HTMLDivElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const dragging   = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos   = useRef({ x: 0, y: 0 });
  const msgCounter = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

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

  function showToast(msg: string) {
    setToast(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

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

  const executeCommand = useCallback((cmd: string) => {
    const result  = getResponse(cmd);
    const id1     = ++msgCounter.current;
    const id2     = ++msgCounter.current;
    const userMsg: Message = { id: id1, role: "user", lines: [cmd] };

    const addMsg = (lines: string[]) =>
      setMessages(prev => [...prev, userMsg, { id: id2, role: "eli", lines }]);

    switch (result) {
      case "__CONTACT__":
        addMsg(["Navigating to contact section..."]);
        setTimeout(() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }), 400);
        break;
      case "__EMAIL__":
        navigator.clipboard.writeText(SUMAN_EMAIL).then(() => showToast("Email copied to clipboard!"));
        addMsg([`Copied ${SUMAN_EMAIL} to clipboard.`]);
        break;
      case "__GITHUB__":
        window.open("https://github.com/sumanbiswas7", "_blank");
        addMsg(["Opening GitHub profile..."]);
        break;
      case "__CONNECT__":
        window.open("https://linkedin.com/in/sumanbiswas7", "_blank");
        addMsg(["Opening LinkedIn profile..."]);
        break;
      case "__TWITTER__":
        window.open("https://x.com/sumanbiswas7", "_blank");
        addMsg(["Opening Twitter / X profile..."]);
        break;
      case "__CLEAR__":
        setMessages([]);
        break;
      default:
        addMsg(result);
    }

    setInput("");
    setShowSlashMenu(false);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    setShowSlashMenu(val.startsWith("/"));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) executeCommand(input.trim());
    if (e.key === "Escape") setShowSlashMenu(false);
  }

  const filteredCmds = ALL_COMMANDS.filter(c =>
    c.cmd.startsWith(input.toLowerCase() || "/")
  );

  return (
    <div
      ref={termRef}
      className={`${styles.terminal} ${isFullscreen ? styles.fullscreen : ""}`}
      onClick={() => inputRef.current?.focus()}
    >
      {/* ── Toast ── */}
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* ── Title bar ── */}
      <div className={styles.titleBar} onMouseDown={onTitleBarMouseDown}>
        <div className={styles.trafficLights}>
          <button className={`${styles.light} ${styles.red}`} onClick={onClose} aria-label="Close">
            <span className={styles.lightIcon}>×</span>
          </button>
          <button className={`${styles.light} ${styles.yellow}`} onClick={onClose} aria-label="Minimize">
            <span className={styles.lightIcon}>−</span>
          </button>
          <button className={`${styles.light} ${styles.green}`} onClick={toggleFullscreen} aria-label="Fullscreen">
            <span className={styles.lightIcon}>{isFullscreen ? "↙" : "↗"}</span>
          </button>
        </div>
        <span className={styles.title}>eli — portfolio assistant</span>
        <div className={styles.titleSpacer} />
      </div>

      {/* ── Welcome panel ── */}
      <div className={styles.welcomePanel}>
        <div className={styles.welcomeLeft}>
          <div className={styles.eliArt}>
            <PixelLetter map={LETTER_E} />
            <PixelLetter map={LETTER_L} />
            <PixelLetter map={LETTER_I} />
          </div>
          <p className={styles.welcomeSub}>v1.0 · Portfolio Assistant</p>
          <p className={styles.welcomeHint}>suman&apos;s personal AI · ask anything</p>
        </div>

        <div className={styles.welcomeRight}>
          <div className={styles.infoBlock}>
            <p className={styles.infoHeading}>What I know</p>
            <p className={styles.infoText}>
              Everything about Suman — his projects, skills,{"\n"}
              experience, and how to reach him.
            </p>
          </div>
          <div className={styles.infoDivider} />
          <div className={styles.infoBlock}>
            <p className={styles.infoHeading}>Quick commands</p>
            <div className={styles.quickList}>
              {ALL_COMMANDS.filter(c => PANEL_COMMANDS.includes(c.cmd)).map(c => (
                <button key={c.cmd} className={styles.quickItem} onClick={() => executeCommand(c.cmd)}>
                  <span className={styles.quickCmd}>{c.cmd}</span>
                  <span className={styles.quickDesc}>{c.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Message history ── */}
      {messages.length > 0 && (
        <div className={styles.messages} ref={messagesRef}>
          {messages.map(msg => (
            <div key={msg.id} className={msg.role === "user" ? styles.msgUser : styles.msgEli}>
              <span className={styles.msgPrompt}>{msg.role === "user" ? "you@eli ~ %" : "eli ~ %"}</span>
              <div className={styles.msgLines}>
                {msg.lines.map((line, i) => <p key={i}>{line}</p>)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Input ── */}
      <div className={styles.inputArea}>
        {showSlashMenu && filteredCmds.length > 0 && (
          <div className={styles.slashMenu}>
            {filteredCmds.map(c => (
              <button
                key={c.cmd}
                className={styles.slashItem}
                onMouseDown={() => {
                  setInput(c.cmd);
                  setShowSlashMenu(false);
                  setTimeout(() => inputRef.current?.focus(), 0);
                }}
              >
                <span className={styles.slashCmdLabel}>{c.cmd}</span>
                <span className={styles.slashDescLabel}>{c.desc}</span>
              </button>
            ))}
          </div>
        )}
        <div className={styles.inputRow}>
          <span className={styles.inputPrompt}>you@eli ~ %</span>
          <input
            ref={inputRef}
            className={styles.input}
            placeholder="type / for quick commands…"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            autoFocus
            spellCheck={false}
          />
          <span className={styles.inputHint}>↵ enter</span>
        </div>
      </div>
    </div>
  );
}

// ─── Public wrapper ───────────────────────────────────────────────────────────

export default function EliTerminal() {
  const { isOpen, closeEli } = useEli();
  if (!isOpen) return null;
  return <EliTerminalInner onClose={closeEli} />;
}

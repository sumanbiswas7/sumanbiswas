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
  { cmd: "/twitter",  desc: "Open Twitter profile" },
  { cmd: "/write",    desc: "Rewrite emails & messages" },
  { cmd: "/clear",    desc: "Clear terminal" },
];

const PANEL_COMMANDS = ["/help", "/email", "/github", "/connect", "/write"];
const SUMAN_EMAIL = "hello@sumanx.com";

type Message = { id: number; role: "user" | "eli"; lines: string[] };
type SpecialResult = "__CONTACT__" | "__EMAIL__" | "__GITHUB__" | "__CONNECT__" | "__TWITTER__" | "__WRITE__" | "__CLEAR__";

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
    "  /twitter  — Open Twitter profile",
    "  /write    — Rewrite emails & messages",
    "  /clear    — Clear terminal",
  ];
  if (c === "/who") return [
    "Suman Biswas — Self-taught Fullstack Engineer.",
    "TypeScript is my main tool, but I use whatever fits best.",
    "Outside of code — football, photography, and the mountains.",
    "Real Madrid is part of who I am. Based in India.",
  ];
  if (c === "/contact")  return "__CONTACT__";
  if (c === "/email")    return "__EMAIL__";
  if (c === "/github")   return "__GITHUB__";
  if (c === "/connect")  return "__CONNECT__";
  if (c === "/twitter")  return "__TWITTER__";
  if (c === "/write")    return "__WRITE__";
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
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);

  // Write mode
  const [writeMode, setWriteMode] = useState(false);
  const [writeTone, setWriteTone] = useState<"human" | "ceo">("human");
  const [writeInput, setWriteInput] = useState("");
  const [writeOutput, setWriteOutput] = useState<string | null>(null);
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeStreamingContent, setWriteStreamingContent] = useState<string | null>(null);

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

  function exitWriteMode() {
    setWriteMode(false);
    setWriteInput("");
    setWriteOutput(null);
    setWriteStreamingContent(null);
    setWriteLoading(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  async function handleRewrite() {
    if (!writeInput.trim() || writeLoading) return;
    setWriteLoading(true);
    setWriteOutput(null);
    setWriteStreamingContent("");

    try {
      const res = await fetch("/api/eli/rewrite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: writeInput.trim(), tone: writeTone }),
      });
      const { content, error } = await res.json();
      if (error) throw new Error(error);

      let displayed = "";
      for (const char of content as string) {
        displayed += char;
        setWriteStreamingContent(displayed);
        await new Promise(r => setTimeout(r, 12));
      }
      setWriteOutput(content);
    } catch {
      setWriteOutput("Something went wrong. Try again.");
    } finally {
      setWriteStreamingContent(null);
      setWriteLoading(false);
    }
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
        window.open("https://x.com/hellosumanx", "_blank");
        addMsg(["Opening Twitter profile..."]);
        break;
      case "__WRITE__":
        setWriteMode(true);
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

  async function sendChatMessage(text: string) {
    const id1 = ++msgCounter.current;
    const id2 = ++msgCounter.current;
    setMessages(prev => [...prev, { id: id1, role: "user", lines: [text] }]);
    setInput("");
    setIsStreaming(true);
    setStreamingContent("");

    try {
      const res = await fetch("/api/eli", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const { content, error } = await res.json();
      if (error) throw new Error(error);

      let displayed = "";
      for (const char of content as string) {
        displayed += char;
        setStreamingContent(displayed);
        await new Promise(r => setTimeout(r, 12));
      }

      setMessages(prev => [...prev, { id: id2, role: "eli", lines: (content as string).split("\n").filter(Boolean) }]);
    } catch {
      setMessages(prev => [...prev, { id: id2, role: "eli", lines: ["Something went wrong. Try again."] }]);
    } finally {
      setStreamingContent(null);
      setIsStreaming(false);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setInput(val);
    setShowSlashMenu(val.startsWith("/"));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && input.trim()) {
      if (input.trim().startsWith("/")) {
        executeCommand(input.trim());
      } else if (!isStreaming) {
        sendChatMessage(input.trim());
      }
    }
    if (e.key === "Escape") setShowSlashMenu(false);
  }

  const filteredCmds = ALL_COMMANDS.filter(c =>
    c.cmd.startsWith(input.toLowerCase() || "/")
  );

  return (
    <div
      ref={termRef}
      className={`${styles.terminal} ${isFullscreen ? styles.fullscreen : ""}`}
      onClick={() => !writeMode && inputRef.current?.focus()}
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
        <button
          className={styles.mobileCloseBtn}
          onMouseDown={e => e.stopPropagation()}
          onClick={onClose}
          aria-label="Close terminal"
        >
          ×
        </button>
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
          <div className={styles.mobileEliHeader}>
            <span className={styles.mobileLogo}>ELI</span>
            <div className={styles.mobileEliMeta}>
              <p className={styles.welcomeSub}>v1.0 · Portfolio Assistant</p>
              <p className={styles.welcomeHint}>suman&apos;s personal AI · ask anything</p>
              <p className={styles.mobileInfoDesc}>Projects, skills, experience &amp; how to reach him.</p>
            </div>
          </div>
          <div className={styles.infoBlock}>
            <p className={`${styles.infoHeading} ${styles.hideOnMobile}`}>What I know</p>
            <p className={`${styles.infoText} ${styles.hideOnMobile}`}>
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

      {/* ── Write mode ── */}
      {writeMode ? (
        <div className={styles.writeModeWrapper}>
          <div className={styles.writeModeHeader}>
            <button className={styles.writeModeBack} onClick={exitWriteMode}>
              ← back
            </button>
            <span className={styles.writeModeTitle}>email / message rewriter</span>
            <div className={styles.writeToneToggle}>
              <button
                className={`${styles.writeToneBtn} ${writeTone === "human" ? styles.writeToneBtnActive : ""}`}
                onClick={() => setWriteTone("human")}
              >
                human
              </button>
              <button
                className={`${styles.writeToneBtn} ${writeTone === "ceo" ? styles.writeToneBtnActive : ""}`}
                onClick={() => setWriteTone("ceo")}
              >
                ceo
              </button>
            </div>
          </div>

          <div className={styles.writeInputArea}>
            <textarea
              className={styles.writeTextarea}
              placeholder="paste your message or email here..."
              value={writeInput}
              onChange={e => setWriteInput(e.target.value)}
              disabled={writeLoading}
              rows={5}
              spellCheck={false}
            />
          </div>

          <div className={styles.writeSubmitRow}>
            <button
              className={styles.writeSubmitBtn}
              onClick={handleRewrite}
              disabled={writeLoading || !writeInput.trim()}
            >
              {writeLoading ? "rewriting..." : "rewrite →"}
            </button>
          </div>

          {(writeOutput !== null || writeStreamingContent !== null) && (
            <div className={styles.writeOutputArea}>
              <div className={styles.writeOutputHeader}>
                <span className={styles.writeOutputLabel}>eli ~ %</span>
                {writeOutput !== null && !writeLoading && (
                  <button
                    className={styles.writeCopyBtn}
                    onClick={() => {
                      navigator.clipboard.writeText(writeOutput!);
                      showToast("Copied!");
                    }}
                  >
                    copy
                  </button>
                )}
              </div>
              {writeStreamingContent !== null ? (
                writeStreamingContent ? (
                  <p className={styles.writeOutputText}>{writeStreamingContent}</p>
                ) : (
                  <p className={`${styles.writeOutputText} ${styles.thinking}`}>
                    rewriting<span className={styles.thinkingDots}>...</span>
                  </p>
                )
              ) : (
                <p className={styles.writeOutputText}>{writeOutput}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* ── Message history ── */}
          {(messages.length > 0 || isStreaming) && (
            <div className={styles.messages} ref={messagesRef}>
              {messages.map(msg => (
                <div key={msg.id} className={msg.role === "user" ? styles.msgUser : styles.msgEli}>
                  <span className={styles.msgPrompt}>{msg.role === "user" ? "you@eli ~ %" : "eli ~ %"}</span>
                  <div className={styles.msgLines}>
                    {msg.lines.map((line, i) => <p key={i}>{line}</p>)}
                  </div>
                </div>
              ))}
              {isStreaming && (
                <div className={styles.msgEli}>
                  <span className={styles.msgPrompt}>eli ~ %</span>
                  <div className={styles.msgLines}>
                    {streamingContent
                      ? streamingContent.split("\n").map((line, i) => <p key={i}>{line}</p>)
                      : <p className={styles.thinking}>thinking<span className={styles.thinkingDots}>...</span></p>
                    }
                  </div>
                </div>
              )}
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
                placeholder={isStreaming ? "eli is thinking…" : "type a message or / for commands…"}
                disabled={isStreaming}
                value={input}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                autoFocus
                spellCheck={false}
              />
              <span className={styles.inputHint}>↵ enter</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Public wrapper ───────────────────────────────────────────────────────────

export default function EliTerminal() {
  const { isOpen, closeEli } = useEli();
  if (!isOpen) return null;
  return <EliTerminalInner onClose={closeEli} />;
}

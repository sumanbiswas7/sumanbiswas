"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import { useEli } from "@/context/EliContext";
import styles from "./EliTerminal.module.scss";

export default function EliTerminal() {
  const { isOpen, closeEli } = useEli();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [ready, setReady] = useState(false);
  const dragging = useRef(false);
  const startMouse = useRef({ x: 0, y: 0 });
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && !ready) {
      setPos({
        x: Math.max(0, (window.innerWidth - 660) / 2),
        y: Math.max(0, (window.innerHeight - 420) / 2),
      });
      setReady(true);
    }
    if (!isOpen) {
      setReady(false);
      setIsFullscreen(false);
    }
  }, [isOpen, ready]);

  useEffect(() => {
    function onMouseMove(e: MouseEvent) {
      if (!dragging.current) return;
      setPos({
        x: startPos.current.x + e.clientX - startMouse.current.x,
        y: startPos.current.y + e.clientY - startMouse.current.y,
      });
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
    dragging.current = true;
    startMouse.current = { x: e.clientX, y: e.clientY };
    startPos.current = { ...pos };
    e.preventDefault();
  }, [isFullscreen, pos]);

  if (!isOpen || !ready) return null;

  return (
    <div
      className={`${styles.terminal} ${isFullscreen ? styles.fullscreen : ""}`}
      style={isFullscreen ? {} : { left: pos.x, top: pos.y }}
    >
      {/* Title bar */}
      <div className={styles.titleBar} onMouseDown={onTitleBarMouseDown}>
        <div className={styles.trafficLights}>
          <button
            className={`${styles.light} ${styles.red}`}
            onClick={closeEli}
            aria-label="Close"
          />
          <button
            className={`${styles.light} ${styles.yellow}`}
            onClick={closeEli}
            aria-label="Minimize"
          />
          <button
            className={`${styles.light} ${styles.green}`}
            onClick={() => setIsFullscreen((f) => !f)}
            aria-label="Toggle fullscreen"
          />
        </div>
        <span className={styles.title}>eli — zsh</span>
        <div className={styles.titleSpacer} />
      </div>

      {/* Terminal body */}
      <div className={styles.body}>
        <div className={styles.line}>
          <span className={styles.prompt}>eli@suman ~ %</span>
          <span className={styles.cmd}> greet</span>
        </div>
        <div className={styles.outputBlock}>
          <p className={styles.output}>Hello There! 👋 I am Eli.</p>
          <p className={styles.output}>I know everything about Suman — his projects,</p>
          <p className={styles.output}>tech stack, and what makes him tick.</p>
          <p className={styles.output}>Ask me anything.</p>
        </div>
        <div className={styles.inputLine}>
          <span className={styles.prompt}>eli@suman ~ %</span>
          <span className={styles.cursor}>█</span>
        </div>
      </div>
    </div>
  );
}

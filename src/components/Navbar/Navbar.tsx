"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Gamepad2, Shuffle, Home, Briefcase, Mail, Bot, X, Menu } from "lucide-react";
import { useBentoGrid } from "@/components/BentoGrid/BentoGridContext";
import { useEli } from "@/context/EliContext";
import { useGame } from "@/context/GameContext";
import styles from "./Navbar.module.scss";

const NAV_ITEMS = [
  { label: "Home",       id: "home",    icon: Home      },
  { label: "Work",       id: "work",    icon: Briefcase },
  { label: "Contact",    id: "contact", icon: Mail      },
  { label: "Playground", id: null,      icon: Gamepad2  },
  { label: "Try Eli",    id: null,      icon: Bot       },
];

const SOCIALS = [
  {
    label: "GitHub",
    href: "https://github.com/sumanbiswas7",
    icon: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
      </svg>
    ),
  },
  {
    label: "X / Twitter",
    href: "https://x.com/hellosumanx",
    icon: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sumanbiswas7",
    icon: () => (
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const { shuffle, highlightCard } = useBentoGrid();
  const { openEli } = useEli();
  const { openGame } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  function handleShuffle() {
    shuffle();
    setSpinning(true);
    setTimeout(() => setSpinning(false), 500);
  }

  function handleNavClick(item: typeof NAV_ITEMS[0]) {
    setMenuOpen(false);
    if (item.label === "Try Eli") { openEli(); return; }
    if (item.label === "Playground") { openGame(); return; }
    if (item.id) document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.left}>
          <Link href="/" onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); history.pushState("", "", "/"); }}>
            <Image src="/logo.svg" alt="Suman Biswas logo" width={40} height={40} className={styles.logoImg} />
          </Link>
          <div className={styles.identity}>
            <span className={styles.name}>Suman Biswas</span>
          </div>
        </div>

        {/* Desktop right */}
        <div className={styles.right}>
          <div className={styles.links}>
            <a href="#work">work</a>
            <a href="#home" onClick={() => { highlightCard("bio"); }}>about</a>
            <a href="#contact">contact</a>
          </div>
          <button className={styles.shuffleBtn} aria-label="Shuffle cards" onClick={handleShuffle}>
            <Shuffle size={16} className={spinning ? styles.shuffleIconSpin : ""} />
          </button>
          <button className={styles.gameBtn} aria-label="Open playground" onClick={openGame}>
            <Gamepad2 size={18} />
          </button>
          <button className={styles.botBtn} aria-label="Chat bot" onClick={openEli}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="14" rx="3" />
              <path d="M8 17v4M16 17v4M8 21h8" />
              <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
              <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
            </svg>
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          className={styles.menuBtn}
          aria-label="Open menu"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={18} />
        </button>
      </nav>

      {/* Mobile overlay */}
      {menuOpen && (
        <div className={styles.mobileOverlay} onClick={() => setMenuOpen(false)}>
          <div className={styles.mobileMenu} onClick={(e) => e.stopPropagation()}>
            <div className={styles.mobileMenuHeader}>
              <div className={styles.mobileProfile}>
                <div className={styles.mobileAvatar}>
                  <Image src="/me.webp" alt="Suman Biswas" fill sizes="48px" className={styles.mobileAvatarImg} />
                </div>
                <div>
                  <p className={styles.mobileProfileName}>Suman Biswas</p>
                  <p className={styles.mobileProfileRole}>FullStack Engineer</p>
                </div>
              </div>
              <button className={styles.mobileCloseBtn} aria-label="Close menu" onClick={() => setMenuOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.mobileDivider} />

            <nav className={styles.mobileNav}>
              {NAV_ITEMS.map((item) => (
                <button key={item.label} className={styles.mobileNavItem} onClick={() => handleNavClick(item)}>
                  <item.icon size={16} className={styles.mobileNavIcon} />
                  {item.label}
                </button>
              ))}
            </nav>

            <div className={styles.mobileDivider} />

            <div className={styles.mobileSocials}>
              {SOCIALS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.mobileSocialLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.mobileNavIcon}><Icon /></span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

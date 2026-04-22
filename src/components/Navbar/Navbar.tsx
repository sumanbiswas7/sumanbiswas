import Image from "next/image";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <Image src="/logo.svg" alt="Suman Biswas logo" width={40} height={40} />
        <div className={styles.identity}>
          <span className={styles.name}>Suman Biswas</span>
          {/* <span className={styles.role}>FullStack Engineer</span> */}
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.links}>
          <a href="#work">work</a>
          <a href="#about">about</a>
          <a href="#contact">contact</a>
        </div>
        <button className={styles.botBtn} aria-label="Chat bot">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="18" height="14" rx="3" />
            <path d="M8 17v4M16 17v4M8 21h8" />
            <circle cx="9" cy="10" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="15" cy="10" r="1.5" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </div>
    </nav>
  );
}

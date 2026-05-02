"use client";
import { useState } from "react";
import Image from "next/image";
import { Home, Briefcase, Mail, Gamepad2, Bot } from "lucide-react";
import { useEli } from "@/context/EliContext";
import { useGame } from "@/context/GameContext";
import styles from "./Sidebar.module.scss";

const COLORS = {
  sage: "#9aa59a",
  stone: "#8a8a82",
  clay: "#b8a394",
};

type IconProps = { color: string; size: number };

function FlowerIcon({ color, size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40.172 15.1006C42.5462 13.723 45.0023 13.6162 47.4406 13.8761C51.9612 14.3531 55.5314 16.4389 57.7953 20.5146C59.301 23.227 59.1728 26.0212 58.0302 28.7656C57.3753 30.3318 56.3928 31.7663 55.4567 33.4358C55.8929 33.7734 56.3601 34.069 56.852 34.3185C59.9275 35.5715 61.6538 38.0276 62.7039 40.9998C63.8428 44.2965 64.0703 47.8395 63.3624 51.2548C63.2013 52.2099 62.8509 53.1232 62.332 53.9411C61.813 54.7589 61.1359 55.4649 60.3404 56.0175C58.0302 57.6834 55.5279 58.6409 52.6696 58.6302C51.6586 58.6302 50.6513 58.6302 49.8219 58.6302C49.021 59.1428 49.11 59.8084 49.0175 60.385C48.6615 62.5813 47.4691 64.3789 46.0915 66.0162C43.0196 69.6648 36.8154 70.5902 32.6756 68.2018C31.3657 67.4472 30.6965 66.1729 29.7995 65.0908C29.1805 64.2478 28.6111 63.3695 28.0945 62.4603C27.6897 62.5376 27.2962 62.6656 26.9234 62.8411C24.6738 64.3077 22.1465 65.1086 19.6334 65.9344C15.2232 67.3831 11.0905 65.9344 8.33546 62.1755C7.03804 60.3395 6.17505 58.2325 5.81174 56.0139C5.29041 53.2744 5.83403 50.4392 7.33167 48.0868C7.91899 47.1329 8.58819 46.2359 9.33569 45.1431C8.93378 44.7494 8.49781 44.3921 8.0329 44.0752C6.8013 43.3633 5.54122 42.7119 4.2669 42.0392C1.60437 40.6011 0.283776 38.3586 0.0488463 35.3793C-0.193483 32.5086 0.470029 29.6342 1.94608 27.1603C2.62322 26.0127 3.54782 25.0306 4.65251 24.2855C5.75721 23.5404 7.01419 23.0511 8.3319 22.8532C9.72724 22.6112 11.1439 22.4973 12.493 22.3335C12.5962 22.0452 12.7493 21.8388 12.703 21.7035C11.5746 18.4465 11.5782 15.0899 11.863 11.7368C12.087 9.28899 12.9377 6.94016 14.3333 4.91671C15.8781 2.62436 18.3449 1.42124 20.865 0.606103C23.6233 -0.23589 26.575 -0.199817 29.3118 0.709329C34.491 2.35028 37.6269 5.99881 38.8016 11.3239C39.0401 12.5092 39.2608 13.7088 40.172 15.1006Z" fill="black" fillOpacity="0.35" />
      <path d="M31.3267 57.6192C30.9076 57.3861 30.4749 57.1781 30.0311 56.9963C28.86 56.619 27.7031 56.74 27.0944 57.8755C25.1937 61.403 21.7551 62.3962 18.3059 63.3821C17.6135 63.5752 16.8857 63.6043 16.1801 63.4671C15.4745 63.33 14.8106 63.0303 14.2409 62.5919C9.64201 59.3421 7.94767 50.8704 13.376 46.6452C14.2623 45.9546 15.2163 45.3353 15.2874 43.8616C14.8674 43.5947 14.4189 43.1497 13.8636 42.9824C11.4004 42.1886 9.31453 40.7007 7.14321 39.3908C5.24954 38.2482 4.35965 36.4791 4.37033 34.2615C4.33488 32.7334 4.59973 31.2133 5.14987 29.7872C6.23909 27.114 8.26091 25.8717 11.0124 25.6973C12.0304 25.6768 13.0482 25.7399 14.0558 25.8859C14.7584 25.9716 15.4712 25.887 16.1341 25.6391C16.797 25.3913 17.3905 24.9876 17.8646 24.4621C17.3342 22.4225 16.7611 20.4825 16.3411 18.507C15.8418 16.2129 15.7216 13.8526 15.9851 11.5196C16.3126 8.67199 17.6261 6.53626 20.1533 5.15872C21.7658 4.26884 23.2822 3.25081 25.2506 3.28284C29.1661 3.34691 31.7218 5.4684 33.4055 8.76098C34.7785 11.5084 35.4903 14.5386 35.4843 17.61C35.4843 18.2187 35.4416 18.8345 35.4843 19.4432C35.4953 19.7494 35.5852 20.0476 35.7452 20.3088C35.9053 20.5701 36.1301 20.7857 36.3979 20.9346C36.6656 21.0835 36.9673 21.1608 37.2737 21.1589C37.5801 21.157 37.8809 21.0761 38.1468 20.9239C38.4825 20.6993 38.8025 20.4519 39.1043 20.1835C40.1513 19.3797 41.2397 18.6312 42.3649 17.941C47.5369 15.072 53.9405 18.3646 54.4673 24.245C54.6773 26.6263 53.7554 28.8439 52.3316 30.7803C51.7905 31.5136 51.0858 32.1258 50.5091 32.8377C50.1924 33.2265 49.9434 33.6656 49.7723 34.137C49.701 34.3021 49.6656 34.4805 49.6683 34.6603C49.6711 34.8402 49.7121 35.0174 49.7884 35.1803C49.8648 35.3431 49.9749 35.4879 50.1114 35.605C50.2479 35.7222 50.4077 35.809 50.5803 35.8598C51.3603 36.0812 52.1566 36.2406 52.9616 36.3367C54.1821 36.5096 55.3052 37.0995 56.1403 38.0062C58.753 40.6616 59.6073 43.9186 59.3866 47.5244C59.3027 48.5403 59.1601 49.5505 58.9595 50.55C58.4647 53.2908 56.692 54.9923 53.9014 55.5334C52.0575 55.8893 50.3418 55.8644 48.562 54.9745C47.6045 54.4904 46.4263 54.4335 45.3086 54.2982C44.6679 54.2199 44.1874 54.8321 44.2194 55.4942C44.2056 55.7987 44.2441 56.1033 44.3333 56.3948C45.3051 58.5696 44.7142 60.5808 43.7104 62.5457C43.4373 63.0907 43.1331 63.6196 42.7991 64.1296C41.1724 66.5679 39.5956 67.1837 36.8049 66.3793C36.1229 66.1981 35.5059 65.828 35.0251 65.3114C33.1777 63.0903 31.6079 60.716 31.3267 57.6192ZM33.0033 29.9509C32.3946 29.9509 31.7824 29.926 31.1737 29.9509C28.8279 30.0684 27.1229 31.2359 26.0479 33.2684C25.1404 34.8747 24.6109 36.6666 24.4995 38.5081C24.3785 41.8825 25.5033 44.4632 28.9632 45.7019C30.5845 46.2998 32.3004 46.6001 34.0284 46.5882C37.0932 46.5135 39.4639 45.0398 40.7916 42.153C41.5899 40.494 42.0474 38.6918 42.1371 36.8529C42.1869 35.3116 41.8665 33.724 40.5495 32.7167C38.3212 31.033 35.9328 29.684 32.9855 29.9509H33.0033Z" fill={color} />
      <path d="M28.6855 38.3016C29.2302 32.9125 30.508 32.2504 35.0037 33.3859C37.3139 33.9804 38.1646 35.6533 37.6876 38.0418C37.3032 39.9746 36.6838 41.7402 34.84 42.8151C32.5797 44.1357 30.3763 43.5057 29.369 41.0852C28.9525 40.0814 28.835 38.9495 28.6855 38.3016Z" fill={color} fillOpacity="0.7" />
    </svg>
  );
}

function StarIcon({ color, size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" fill={color} fillOpacity="0.85" />
    </svg>
  );
}

function TreeIcon({ color, size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 19a4 4 0 0 1-2.24-7.32A3.5 3.5 0 0 1 9 6.03V6a3 3 0 1 1 6 0v.04a3.5 3.5 0 0 1 3.24 5.65A4 4 0 0 1 16 19Z" />
      <path d="M12 19v3" />
    </svg>
  );
}

function PalmIcon({ color, size }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M13 8c0-2.76-2.46-5-5.5-5S2 5.24 2 8h2l1-1 1 1h4" />
      <path d="M13 7.14A5.82 5.82 0 0 1 16.5 6c3.04 0 5.5 2.24 5.5 5h-3l-1-1-1 1h-3" />
      <path d="M5.89 9.71c-2.15 2.15-2.3 5.47-.35 7.43l4.24-4.25.7-.7.71-.71 2.12-2.12c-1.95-1.96-5.27-1.8-7.42.35" />
      <path d="M11 15.5c.5 2.5-.17 4.5-1 6.5h4c2-5.5-.5-12-1-14" />
    </svg>
  );
}

type IconSet = "flower" | "star" | "tree" | "palm";
const ICON_SETS: IconSet[] = ["flower", "star", "tree", "palm"];

const POSITIONS = [
  { top: "2%",  left: "0.5rem",   size: 38, color: COLORS.sage  },
  { top: "10%", left: "2.5rem",   size: 28, color: COLORS.clay  },
  { top: "18%", left: "0.875rem", size: 44, color: COLORS.stone },
  { top: "26%", left: "2.25rem",  size: 32, color: COLORS.sage  },
  { top: "34%", left: "0.375rem", size: 24, color: COLORS.clay  },
  { top: "42%", left: "2.75rem",  size: 40, color: COLORS.stone },
  { top: "50%", left: "0.75rem",  size: 30, color: COLORS.sage  },
  { top: "58%", left: "2.375rem", size: 22, color: COLORS.clay  },
  { top: "66%", left: "0.5rem",   size: 42, color: COLORS.stone },
  { top: "74%", left: "2rem",     size: 26, color: COLORS.sage  },
  { top: "82%", left: "1rem",     size: 36, color: COLORS.clay  },
  { top: "90%", left: "2.625rem", size: 20, color: COLORS.stone },
];

const NAV_ITEMS = [
  { label: "Home",       id: "home",    icon: Home      },
  { label: "Work",       id: "work",    icon: Briefcase },
  { label: "Contact",    id: "contact", icon: Mail      },
  { label: "Playground", id: "home",   icon: Gamepad2  },
  { label: "Try Eli",    id: "home",   icon: Bot       },
];

function IconGithub() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.013-1.703-2.782.604-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0 1 12 6.836a9.59 9.59 0 0 1 2.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SOCIALS = [
  { label: "GitHub",     href: "https://github.com/sumanbiswas7", icon: IconGithub   },
  { label: "Twitter", href: "https://x.com/hellosumanx",                  icon: IconX        },
  { label: "LinkedIn",   href: "https://www.linkedin.com/in/sumanbiswas7",             icon: IconLinkedin },
];

function renderIcon(set: IconSet, color: string, size: number) {
  switch (set) {
    case "star":  return <StarIcon color={color} size={size} />;
    case "tree":  return <TreeIcon color={color} size={size} />;
    case "palm":  return <PalmIcon color={color} size={size} />;
    default:      return <FlowerIcon color={color} size={size} />;
  }
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function Sidebar({ expanded = false }: { expanded?: boolean }) {
  const [iconSet, setIconSet] = useState<IconSet>("flower");
  const [spinning, setSpinning] = useState(false);
  const { openEli } = useEli();
  const { openGame } = useGame();

  function handleClick() {
    if (spinning) return;
    setSpinning(true);
    const others = ICON_SETS.filter((s) => s !== iconSet);
    setIconSet(others[Math.floor(Math.random() * others.length)]);
    setTimeout(() => setSpinning(false), 500);
  }

  return (
    <aside className={`${styles.sidebar} ${expanded ? styles.expanded : ""}`}>
      {/* Flowers — fade out when expanded */}
      <div className={`${styles.flowersLayer} ${expanded ? styles.flowersHidden : ""}`}>
        {POSITIONS.map((f, i) => (
          <div key={i} className={styles.flower} style={{ top: f.top, left: f.left }}>
            {renderIcon(iconSet, f.color, f.size)}
          </div>
        ))}
      </div>

      {/* Expanded panel */}
      <div className={`${styles.expandedPanel} ${expanded ? styles.expandedPanelVisible : ""}`}>

        {/* Profile */}
        <div className={styles.profile}>
          <div className={styles.avatarWrap}>
            <Image src="/me.webp" alt="Suman Biswas" fill sizes="112px" className={styles.avatar} />
          </div>
          <p className={styles.profileName}>Suman Biswas</p>
          <p className={styles.profileRole}>FullStack Engineer</p>
        </div>

        <div className={styles.divider} />

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, id, icon: Icon }) => (
            <button
              key={label}
              className={styles.navItem}
              onClick={() => label === "Try Eli" ? openEli() : label === "Playground" ? openGame() : scrollToSection(id)}
            >
              <Icon size={15} className={styles.navIcon} />
              {label}
            </button>
          ))}
        </nav>

        <div className={styles.divider} />

        {/* Socials */}
        <div className={styles.socials}>
          {SOCIALS.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.socialLink}
            >
              <span className={styles.navIcon}><Icon /></span>
              {label}
            </a>
          ))}
        </div>
      </div>

      {/* Shuffle button */}
      <button
        className={`${styles.shuffleBtn}${spinning ? ` ${styles.spinning}` : ""}${expanded ? ` ${styles.shuffleHidden}` : ""}`}
        aria-label="Shuffle"
        onClick={handleClick}
      >
        <span className={styles.dot} />
        <span className={styles.icon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 3h5v5" />
            <path d="M4 20 21 3" />
            <path d="M21 16v5h-5" />
            <path d="M15 15l6 6" />
            <path d="M4 4l5 5" />
          </svg>
        </span>
      </button>
    </aside>
  );
}

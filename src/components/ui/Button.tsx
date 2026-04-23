import { LucideIcon } from "lucide-react";
import styles from "./Button.module.scss";

interface ButtonProps {
  label: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  onClick?: () => void;
  href?: string;
  target?: string;
  rel?: string;
  className?: string;
}

export default function Button({
  label,
  icon: Icon,
  variant = "primary",
  onClick,
  href,
  target,
  rel,
  className,
}: ButtonProps) {
  const cls = `${styles.btn} ${styles[variant]}${className ? ` ${className}` : ""}`;
  const content = (
    <>
      {label}
      {Icon && <Icon size={16} strokeWidth={2} />}
    </>
  );

  if (href) {
    return (
      <a className={cls} href={href} target={target} rel={rel}>
        {content}
      </a>
    );
  }

  return (
    <button className={cls} onClick={onClick}>
      {content}
    </button>
  );
}

import { LucideIcon } from "lucide-react";
import styles from "./Button.module.scss";

interface ButtonProps {
  label: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  onClick?: () => void;
}

export default function Button({
  label,
  icon: Icon,
  variant = "primary",
  onClick,
}: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]}`}
      onClick={onClick}
    >
      {label}
      {Icon && <Icon size={16} strokeWidth={2} />}
    </button>
  );
}

import { forwardRef } from "react";
import styles from "./BentoGrid.module.scss";

interface CardProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ style, className, children, onMouseEnter, onMouseLeave }, ref) => (
    <div
      ref={ref}
      className={`${styles.card} ${className ?? ""}`}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </div>
  )
);
Card.displayName = "Card";

export default Card;

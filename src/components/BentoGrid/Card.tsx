import styles from './BentoGrid.module.scss';

interface CardProps {
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
}

export default function Card({ style, className, children }: CardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`} style={style}>
      {children}
    </div>
  );
}

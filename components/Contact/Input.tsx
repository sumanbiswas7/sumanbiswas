import Lottie from "lottie-react";
import name_lottie from "../../public/lotties/name.json";
import phone_lottie from "../../public/lotties/phone.json";
import email_lottie from "../../public/lotties/email.json";
import message_lottie from "../../public/lotties/message.json";
import styles from "./Input.module.scss";

interface Props {
  data: any;
  title?: string;
  style?: any;
  className?: any;
}

export function Input({ data, title, style, className }: Props) {
  return (
    <div
      id={styles.box}
      style={style}
      className={`${styles.input_box} ${className}`}
    >
      <Lottie animationData={data} className={styles.icon} />
      <input placeholder={title || ""} id={styles.input} />
    </div>
  );
}

export function InputArea({ data, title, className }: Props) {
  return (
    <div className={`${styles.inputarea_box} ${styles.input_box} ${className}`}>
      <Lottie
        animationData={data}
        className={`${styles.icon} ${styles.area_icon}`}
      />
      <textarea placeholder={title || ""} />
    </div>
  );
}

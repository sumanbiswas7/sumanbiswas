import styles from "./Terminal.module.scss";
import { useEffect, useRef, useState } from "react";
import {
  AboutCmd,
  ContactCmd,
  ErrorCmd,
  HelpCmd,
  SkillsCmd,
  TypeHelp,
} from "../../components/Terminal/CmdComponents";
import { JsxElement } from "typescript";
import { useRouter } from "next/router";
import { socialLinks } from "./SocialLinks";

interface TerminalProps {
  skillsPage?: boolean;
}
export function Terminal({ skillsPage }: TerminalProps) {
  const [outPut, setOutput] = useState<any>([]);
  const [firstLoad, setFirstLoad] = useState<boolean>(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (skillsPage) setOutput([<SkillsCmd />]);
    // inputRef.current?.focus();
  }, []);

  const focusInput = () => inputRef.current?.focus();

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key == "Enter") {
      setFirstLoad(false);
      const command = inputRef.current?.value.toLowerCase().replace(" ", "");
      const prev = [...outPut];
      prev.push(<InputCmd cmd={command} />);

      // Command Lists
      if (command == "skills") {
        prev.push(<SkillsCmd />);
        setOutput(prev);
      } else if (command == "help") {
        prev.push(<HelpCmd />);
        setOutput(prev);
      } else if (command == "about") {
        prev.push(<AboutCmd />);
        setOutput(prev);
      } else if (command == "contact") {
        prev.push(<ContactCmd />);
        setOutput(prev);
      } else if (command == "clear" || command == "cls") {
        setOutput([<TypeHelp />]);
      } else if (command == "exit") {
        router.replace("/#home");
      } else if (command?.includes("to--")) {
        const link = command.substring(4);
        if (socialLinks[link as keyof typeof socialLinks]) {
          window.open(socialLinks[link as keyof typeof socialLinks], "_blank");
          prev.push(<p className={styles.link_social}>Opening - {link}</p>);
        } else {
          prev.push(
            <p className={styles.link_social}>{link} link not found</p>
          );
        }
        setOutput(prev);
      } else if (command?.includes("j--")) {
        const link = command.substring(3);
        router.replace(`/#${link}`);
      } else {
        prev.push(<ErrorCmd />);
        setOutput(prev);
      }
      inputRef.current!.value = "";
    }
  };

  return (
    <div id="skills" className={styles.new_page} onClick={focusInput}>
      <div className={styles.terminal_container}>
        <div className={styles.terminal_box_head}>
          <span className={styles.head_circle}></span>
          <span className={styles.head_circle}></span>
          <span className={styles.head_circle}></span>
          <div id={styles.img_reveal}></div>
        </div>
        <div className={styles.terminal_box_content}>
          {outPut.map((e: JsxElement) => e)}
          {firstLoad && <TypeHelp />}
          <InputCmd cmdRef={inputRef} handleEnter={handleKeyDown} />
        </div>
      </div>
    </div>
  );
}

interface InputCmdProps {
  cmd?: string;
  handleEnter?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  cmdRef?: React.LegacyRef<HTMLInputElement>;
}

function InputCmd({ cmd, handleEnter, cmdRef }: InputCmdProps) {
  return (
    <>
      <label className={styles.inp_prefix}>
        suman@terminal<span>$</span>
      </label>
      <input
        onKeyDown={handleEnter}
        ref={cmdRef}
        className={styles.term_input}
        value={cmd}
      />
    </>
  );
}
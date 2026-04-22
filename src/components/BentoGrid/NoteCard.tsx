"use client";

import { useState, useRef, useEffect } from "react";
import { NotebookText, Plus, Check } from "lucide-react";
import Card from "./Card";
import styles from "./BentoGrid.module.scss";

interface NoteItem {
  id: number;
  label: string;
  done: boolean;
}

const INITIAL_ITEMS: NoteItem[] = [
  { id: 1, label: "Add case studies", done: true },
  { id: 2, label: "Improve animations", done: false },
  { id: 3, label: "Write blog post", done: false },
];

export default function NoteCard() {
  const [items, setItems] = useState<NoteItem[]>(INITIAL_ITEMS);
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  function toggle(id: number) {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, done: !item.done } : item,
      ),
    );
  }

  function addItem() {
    const trimmed = draft.trim();
    if (trimmed) {
      setItems((prev) => [
        ...prev,
        { id: Date.now(), label: trimmed, done: false },
      ]);
    }
    setDraft("");
    setAdding(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") addItem();
    if (e.key === "Escape") {
      setDraft("");
      setAdding(false);
    }
  }

  return (
    <Card className={styles.noteCard}>
      <div className={styles.noteCardHeader}>
        <div className={styles.noteCardTitle}>
          <span className={styles.noteCardTitleIcon}>
            <NotebookText size={15} />
          </span>
          <span>Notes</span>
        </div>
      </div>

      <div className={styles.noteCardInner}>
        <div className={styles.noteCardTape} />
        <p className={styles.noteCardNoteTitle}>Plan new portfolio</p>
        <ul className={styles.noteCardList}>
          {items.map((item) => (
            <li
              key={item.id}
              className={styles.noteCardItem}
              onClick={() => toggle(item.id)}
            >
              <span
                className={`${styles.noteCardCheck} ${item.done ? styles.noteCardCheckDone : ""}`}
              >
                {item.done && <Check size={9} strokeWidth={3} />}
              </span>
              <span className={item.done ? styles.noteCardItemDone : ""}>
                {item.label}
              </span>
            </li>
          ))}
          {adding && (
            <li className={styles.noteCardItem}>
              <span className={styles.noteCardCheck} />
              <input
                ref={inputRef}
                className={styles.noteCardInput}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={onKeyDown}
                onBlur={addItem}
                placeholder="New item..."
              />
            </li>
          )}
        </ul>
      </div>

      <button className={styles.noteCardAddBtn} onClick={() => setAdding(true)}>
        <Plus size={14} />
        Add Note
      </button>
    </Card>
  );
}

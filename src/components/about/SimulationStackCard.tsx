"use client";

import type { CSSProperties } from "react";
import styles from "./SimulationStackCard.module.css";

const stackCards = [
  { color: "142, 249, 252", label: "Persistent State" },
  { color: "142, 252, 204", label: "Faction Memory" },
  { color: "142, 252, 157", label: "Adaptive AI" },
  { color: "215, 252, 142", label: "Live Economies" },
  { color: "252, 252, 142", label: "City Systems" },
  { color: "252, 208, 142", label: "Quest Director" },
  { color: "252, 142, 142", label: "World Governance" },
  { color: "252, 142, 239", label: "Realm Sync" },
  { color: "204, 142, 252", label: "Event Engine" },
  { color: "142, 202, 252", label: "Territory Logic" },
] as const;

export function SimulationStackCard() {
  return (
    <div className={styles.wrapper}>
      <div
        className={styles.inner}
        style={{ "--quantity": stackCards.length } as CSSProperties}
      >
        {stackCards.map(({ color, label }, index) => (
          <div
            key={`${label}-${index}`}
            className={styles.card}
            style={
              {
                "--color-card": color,
                "--index": index,
              } as CSSProperties
            }
          >
            <div className={styles.img}>
              <span className={styles.label}>{label}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

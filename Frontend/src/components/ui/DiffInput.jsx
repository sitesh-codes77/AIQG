import { useState } from "react";

export default function DiffInput({ value, onChange, color, focusRing, disabled }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type="number"
      min={0}
      max={999}
      value={disabled ? "" : value === 0 ? "" : value}
      disabled={disabled}
      onChange={(e) =>
        onChange(
          e.target.value === ""
            ? 0
            : Math.max(0, Math.min(999, Number(e.target.value))),
        )
      }
      onFocus={() => setFocused(true)}
      onWheel={(e) => e.target.blur()}
      onBlur={() => setFocused(false)}
      placeholder={disabled ? "—" : "0"}
      style={{
        width: "68px",
        backgroundColor: disabled ? "var(--card-2)" : "var(--input-bg)",
        border: `1.5px solid ${focused ? color : "var(--input-border)"}`,
        borderRadius: "9px",
        padding: "7px 6px",
        color: disabled ? "var(--text-3)" : "var(--text-1)",
        fontSize: "0.9rem",
        fontWeight: 800,
        textAlign: "center",
        outline: "none",
        boxShadow: focused ? `0 0 0 3px ${focusRing}` : "none",
        transition: "all 0.2s ease",
        cursor: disabled ? "not-allowed" : "text",
      }}
    />
  );
}

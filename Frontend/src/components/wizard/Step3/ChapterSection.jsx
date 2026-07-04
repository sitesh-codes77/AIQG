import { useState } from "react";
import { ChevronDown, ChevronRight, AlertTriangle } from "lucide-react";
import DiffInput from "../../ui/DiffInput";

export const DIFF = [
  {
    key: "easy",
    label: "Easy",
    color: "#76e6c0ff",
    focus: "rgba(16,185,129,0.15)",
  },
  {
    key: "medium",
    label: "Medium",
    color: "#f0bf6aff",
    focus: "rgba(245,158,11,0.15)",
  },
  {
    key: "hard",
    label: "Hard",
    color: "#eb6a6aff",
    focus: "rgba(239,68,68,0.15)",
  },
];

export default function ChapterSection({
  chapter,
  activeTypes,
  chapterData,
  step2Data,
  crossChapterTotals,
  activeChapters,
  chapterMap = {},
  onChange,
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
      }}
    >
      {/* Chapter header */}
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        style={{
          width: "100%",
          padding: "1rem 1.25rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          backgroundColor: "var(--card-2)",
          border: "none",
          cursor: "pointer",
          borderBottom: collapsed ? "none" : "1px solid var(--border)",
          transition: "background-color 0.2s",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              background: "var(--card)",
              borderRadius: "8px",
              padding: "6px",
              color: "var(--text-3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "1px solid var(--border)",
            }}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </div>
          <span
            style={{
              color: "var(--text-1)",
              fontWeight: 700,
              fontSize: "0.9rem",
              letterSpacing: "-0.01em",
              textAlign: "left",
            }}
          >
            {chapterMap[chapter] || chapter}
          </span>
        </div>
        {/* Chapter total */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          {DIFF.map(({ key, color }) => {
            const total = activeTypes.reduce(
              (s, t) => s + ((chapterData[t.key] || {})[key] || 0),
              0,
            );
            return total > 0 ? (
              <span
                key={key}
                style={{
                  color,
                  fontSize: "0.72rem",
                  fontWeight: 800,
                  backgroundColor: `${color}14`,
                  border: `1px solid ${color}25`,
                  padding: "3px 8px",
                  borderRadius: "999px",
                }}
              >
                {total} {key}
              </span>
            ) : null;
          })}
        </div>
      </button>

      {!collapsed && (
        <div
          className="w-full overflow-x-auto custom-scrollbar"
          style={{ paddingBottom: "8px" }}
        >
          <div style={{ minWidth: "500px", padding: "0.75rem 1rem 0" }}>
            {/* Sub-header row */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 90px 90px 90px 80px",
                padding: "10px 12px",
                gap: "12px",
              }}
            >
              <div
                style={{
                  color: "var(--text-3)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Question Type
              </div>
              {DIFF.map(({ label, color }) => (
                <div
                  key={label}
                  style={{
                    color,
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    textAlign: "center",
                  }}
                >
                  {label}
                </div>
              ))}
              <div
                style={{
                  color: "#0EA5E9",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textAlign: "center",
                }}
              >
                Sum
              </div>
            </div>

            {/* One row per active question type */}
            {activeTypes.map((type, idx) => {
              const row = chapterData[type.key] || {
                easy: 0,
                medium: 0,
                hard: 0,
              };
              const rowSum = row.easy + row.medium + row.hard;

              // --- STRICT CHAPTER TARGET LOGIC ---
              const typeConfig = step2Data[type.key] || {};
              const totalCount = typeConfig.count || 0;
              const alloc = typeConfig.chapterAlloc || {};

              let chapterTarget = alloc[chapter];
              // Fallback: If user didn't open 'Configure' in Step 2, distribute evenly so we have a target
              if (chapterTarget === undefined) {
                const perCh = Math.floor(totalCount / activeChapters.length);
                const rem = totalCount % activeChapters.length;
                chapterTarget =
                  activeChapters.indexOf(chapter) === 0 ? perCh + rem : perCh;
              }

              // Hide rows where this chapter has 0 target for this type
              if (chapterTarget === 0) return null;

              const overLimit = rowSum > chapterTarget;

              return (
                <div
                  key={type.key}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "2fr 90px 90px 90px 80px",
                    padding: "12px",
                    alignItems: "center",
                    gap: "12px",
                    borderTop: idx > 0 ? "1px solid var(--border)" : "none",
                    borderRadius: "10px",
                    backgroundColor: "var(--card)",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--card-2)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--card)")
                  }
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        backgroundColor:
                          rowSum > 0 ? "#0EA5E9" : "var(--border-2)",
                      }}
                    />
                    <div>
                      <div
                        style={{
                          color: "var(--text-1)",
                          fontWeight: 700,
                          fontSize: "0.875rem",
                        }}
                      >
                        {type.label}
                      </div>
                      <div
                        style={{
                          color: "var(--text-3)",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        Target: {chapterTarget}
                      </div>
                    </div>
                  </div>
                  {DIFF.map(({ key, color, focus }) => (
                    <div
                      key={key}
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <DiffInput
                        value={row[key]}
                        color={color}
                        focusRing={focus}
                        onChange={(v) =>
                          onChange(type.key, key, v, chapterTarget)
                        }
                      />
                    </div>
                  ))}
                  {/* Row sum */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 800,
                        fontSize: "0.9rem",
                        color:
                          rowSum > chapterTarget
                            ? "#EF4444"
                            : rowSum > 0
                              ? "#0EA5E9"
                              : "var(--text-3)",
                      }}
                    >
                      {rowSum}
                    </span>
                    {rowSum > chapterTarget && (
                      <span
                        style={{
                          color: "#EF4444",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          marginTop: "2px",
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                        }}
                      >
                        <AlertTriangle size={9} /> Exceeds
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

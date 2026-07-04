import { useEffect } from "react";
import { Layers, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Q_TYPES } from "../Step2/Step2QuestionComposition";
import ChapterSection, { DIFF } from "./ChapterSection";

/* ── Safe 40/30/30 distribution (Hamilton / largest-remainder) ── */
function safeDistribute(total, pctEasy = 40, pctMedium = 30, pctHard = 30) {
  if (total <= 0) return { easy: 0, medium: 0, hard: 0 };

  let easy   = Math.floor(total * pctEasy / 100);
  let medium = Math.floor(total * pctMedium / 100);
  let hard   = Math.floor(total * pctHard / 100);

  let remainder = total - (easy + medium + hard);

  const fractions = [
    { key: 'easy',   frac: (total * pctEasy / 100) - easy },
    { key: 'medium', frac: (total * pctMedium / 100) - medium },
    { key: 'hard',   frac: (total * pctHard / 100) - hard },
  ];
  fractions.sort((a, b) => b.frac - a.frac);

  const result = { easy, medium, hard };
  for (let i = 0; i < remainder; i++) {
    result[fractions[i].key]++;
  }

  return result;
}

/* ── Main Step 3 Component ─────────────────────────────── */
export default function Step3DifficultyDistribution({
  step2Data,
  data,
  onUpdate,
  chapters,
  chapterMap = {},
}) {
  const activeTypes = Q_TYPES.filter((t) => (step2Data[t.key]?.count ?? 0) > 0);
  const activeChapters = chapters.length > 0 ? chapters : ["All Chapters"];

  useEffect(() => {
    if (activeTypes.length === 0 || activeChapters.length === 0) return;

    const isEmpty = activeChapters.every((ch) => {
      const chData = data[ch];
      if (!chData) return true;
      return activeTypes.every((t) => {
        const typeData = chData[t.key];
        if (!typeData) return true;
        return (
          typeData.easy === 0 && typeData.medium === 0 && typeData.hard === 0
        );
      });
    });

    if (isEmpty) {
      const newData = { ...data };
      let hasChanges = false;

      activeChapters.forEach((ch) => {
        if (!newData[ch]) newData[ch] = {};
      });

      activeTypes.forEach((type) => {
        const typeConfig = step2Data[type.key] || {};
        const totalCount = typeConfig.count || 0;
        const alloc = typeConfig.chapterAlloc || {};

        if (totalCount > 0) {
          hasChanges = true;
          activeChapters.forEach((ch, idx) => {
            let chapterTarget = alloc[ch];
            if (chapterTarget === undefined) {
              const perCh = Math.floor(totalCount / activeChapters.length);
              const rem = totalCount % activeChapters.length;
              chapterTarget = idx === 0 ? perCh + rem : perCh;
            }

            newData[ch] = {
              ...newData[ch],
              [type.key]: {
                easy: chapterTarget, // Default pushes all questions to Easy initially
                medium: 0,
                hard: 0,
              },
            };
          });
        }
      });

      if (hasChanges) onUpdate(newData);
    }
  }, [chapters, step2Data]);

  const crossChapterTotals = {};
  activeTypes.forEach((type) => {
    crossChapterTotals[type.key] = activeChapters.reduce((sum, ch) => {
      const row = (data[ch] || {})[type.key] || { easy: 0, medium: 0, hard: 0 };
      return sum + row.easy + row.medium + row.hard;
    }, 0);
  });

  // MAX is now passed dynamically from the ChapterSection
  const handleChange = (chapter, typeKey, diffKey, val, maxTarget) => {
    const prev = data[chapter] || {};
    const prevType = prev[typeKey] || { easy: 0, medium: 0, hard: 0 };
    let newType = { ...prevType, [diffKey]: val };
    let sum = newType.easy + newType.medium + newType.hard;

    // Auto-balance if they exceed the chapter target
    if (sum > maxTarget) {
      let excess = sum - maxTarget;
      if (diffKey !== "easy" && newType.easy > 0) {
        const reduceBy = Math.min(newType.easy, excess);
        newType.easy -= reduceBy;
        excess -= reduceBy;
      }
      if (excess > 0 && diffKey !== "medium" && newType.medium > 0) {
        const reduceBy = Math.min(newType.medium, excess);
        newType.medium -= reduceBy;
        excess -= reduceBy;
      }
      if (excess > 0 && diffKey !== "hard" && newType.hard > 0) {
        const reduceBy = Math.min(newType.hard, excess);
        newType.hard -= reduceBy;
        excess -= reduceBy;
      }
      if (excess > 0) {
        newType[diffKey] -= excess;
      }
    }

    onUpdate({
      ...data,
      [chapter]: { ...prev, [typeKey]: newType },
    });
  };

  const grandTotals = { easy: 0, medium: 0, hard: 0 };
  activeChapters.forEach((ch) => {
    activeTypes.forEach((t) => {
      const row = (data[ch] || {})[t.key] || { easy: 0, medium: 0, hard: 0 };
      grandTotals.easy += row.easy;
      grandTotals.medium += row.medium;
      grandTotals.hard += row.hard;
    });
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.75rem" }}>
      <div>
        <h2
          style={{
            fontSize: "1.25rem",
            fontWeight: 800,
            color: "var(--text-1)",
            marginBottom: "0.35rem",
            letterSpacing: "-0.02em",
            textDecoration: "underline",
          }}
        >
          Difficulty Distribution
        </h2>
        <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>
          Distribute question difficulty level per chapter. Ensure the sums
          match configured totals.
        </p>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        {DIFF.map(({ label, color }) => (
          <div
            key={label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              backgroundColor: `${color}10`,
              border: `1px solid ${color}25`,
              borderRadius: "999px",
              padding: "5px 12px",
            }}
          >
            <div
              style={{
                width: "7px",
                height: "7px",
                borderRadius: "50%",
                backgroundColor: color,
              }}
            />
            <span style={{ color, fontSize: "0.75rem", fontWeight: 800 }}>
              {label}
            </span>
          </div>
        ))}
        {activeTypes.length === 0 && (
          <span
            style={{
              color: "var(--text-3)",
              fontSize: "0.82rem",
              display: "flex",
              alignItems: "center",
              gap: "5px",
            }}
          >
            <AlertTriangle size={13} /> Complete Step 2 first to see question
            types.
          </span>
        )}
      </div>

      {activeTypes.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
            gap: "0.875rem",
          }}
        >
          {activeTypes.map((type) => {
            const used = crossChapterTotals[type.key] || 0;
            const max = step2Data[type.key]?.count ?? 0;
            const over = used > max;
            const done = used === max;
            return (
              <div
                key={type.key}
                className="flex flex-col"
                style={{
                  backgroundColor: "var(--card-2)",
                  border: `1.5px solid ${over ? "#EF4444" : done ? "#10B981" : "var(--border)"}`,
                  borderRadius: "14px",
                  padding: "0.85rem 1.1rem",
                  boxShadow: "var(--shadow)",
                  transition: "all 0.25s ease",
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "var(--shadow)";
                }}
              >
                <p
                  style={{
                    color: "var(--text-3)",
                    fontSize: "0.72rem",
                    fontWeight: 800,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  {type.label} Allocation
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <p
                    style={{
                      color: over ? "#EF4444" : done ? "#10B981" : "#0EA5E9",
                      fontWeight: 900,
                      fontSize: "1.35rem",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {used}
                    <span
                      style={{
                        color: "var(--text-3)",
                        fontWeight: 600,
                        fontSize: "0.85rem",
                      }}
                    >
                      {" "} / {max}
                    </span>
                  </p>
                  {done && (
                    <CheckCircle2
                      size={16}
                      color="#10B981"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                  {over && (
                    <AlertTriangle
                      size={16}
                      color="#EF4444"
                      style={{ flexShrink: 0 }}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Chapter sections */}
      {activeTypes.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '-0.5rem' }}>
          <span style={{ color: 'var(--text-3)', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
            Per-Chapter Distribution
          </span>
          <button
            type="button"
            onClick={() => {
              const newData = { ...data };
              activeChapters.forEach((chapter, chapterIdx) => {
                if (!newData[chapter]) newData[chapter] = {};
                activeTypes.forEach((type) => {
                  const typeConfig = step2Data[type.key] || {};
                  const totalCount = typeConfig.count || 0;
                  const alloc = typeConfig.chapterAlloc || {};
                  let chapterTarget = alloc[chapter];
                  if (chapterTarget === undefined) {
                    const perCh = Math.floor(totalCount / activeChapters.length);
                    const rem = totalCount % activeChapters.length;
                    chapterTarget = chapterIdx === 0 ? perCh + rem : perCh;
                  }
                  newData[chapter] = {
                    ...newData[chapter],
                    [type.key]: safeDistribute(chapterTarget),
                  };
                });
              });
              onUpdate(newData);
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              backgroundColor: 'var(--primary-dim)',
              border: '1.5px solid var(--primary-glow)',
              borderRadius: '8px', padding: '7px 14px',
              color: 'var(--primary)', fontSize: '0.78rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--primary-dim)'; e.currentTarget.style.color = 'var(--primary)' }}
          >
            Distribute 40/30/30
          </button>
        </div>
      )}
      <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
        {activeTypes.length > 0 ? (
          activeChapters.map((chapter) => (
            <ChapterSection
              key={chapter}
              chapter={chapter}
              activeTypes={activeTypes}
              chapterData={data[chapter] || {}}
              step2Data={step2Data}
              crossChapterTotals={crossChapterTotals}
              activeChapters={activeChapters}
              onChange={(typeKey, diffKey, val, maxTarget) =>
                handleChange(chapter, typeKey, diffKey, val, maxTarget)
              }
              chapterMap={chapterMap}
            />
          ))
        ) : (
          <div
            style={{
              backgroundColor: "var(--card-2)",
              border: "1px dashed var(--border)",
              borderRadius: "16px",
              padding: "2.5rem 1.5rem",
              textAlign: "center",
              color: "var(--text-3)",
              fontSize: "0.875rem",
            }}
          >
            No active question types found. Go back to Step 2 and set question
            counts.
          </div>
        )}
      </div>

      {/* Grand totals footer stats card */}
      {activeTypes.length > 0 && (
        <>
          {/* Desktop view: aligned grid */}
          <div
            className="hidden md:grid md:grid-cols-[2fr_90px_90px_90px_80px] md:gap-3 items-center"
            style={{
              border: "1.5px solid var(--border)",
              borderRadius: "16px",
              padding: "1.25rem 28px",
              boxShadow: "var(--shadow)",
            }}
          >
            {/* Column 1: Info icon + Title & Subtitle */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  backgroundColor: "var(--primary-dim)",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#0EA5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Layers size={16} />
              </div>
              <div>
                <span
                  style={{
                    color: "var(--text-2)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    display: "block",
                  }}
                >
                  Difficulty Stats Summary
                </span>
                <p
                  style={{
                    color: "var(--text-3)",
                    fontSize: "0.72rem",
                    marginTop: "2px",
                    lineHeight: "1.2",
                  }}
                >
                  Total questions distributed by difficulty level
                </p>
              </div>
            </div>

            {/* Columns 2, 3, 4: Easy, Medium, Hard Totals */}
            {DIFF.map(({ key, label, color }) => (
              <div
                key={key}
                style={{ textAlign: "center" }}
              >
                <div style={{ color, fontWeight: 900, fontSize: "1.3rem", lineHeight: "1.2" }}>
                  {grandTotals[key]}
                </div>
                <div
                  style={{
                    color: "var(--text-3)",
                    fontSize: "0.7rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    marginTop: "4px",
                  }}
                >
                  {label}
                </div>
              </div>
            ))}

            {/* Column 5: Grand Total */}
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  color: "#0EA5E9",
                  fontWeight: 900,
                  fontSize: "1.3rem",
                  lineHeight: "1.2",
                }}
              >
                {grandTotals.easy + grandTotals.medium + grandTotals.hard}
              </div>
              <div
                style={{
                  color: "var(--text-3)",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: "4px",
                }}
              >
                Total
              </div>
            </div>
          </div>

          {/* Mobile view */}
          <div
            className="flex flex-col gap-4 md:hidden"
            style={{
              backgroundColor: "var(--card-2)",
              border: "1.5px solid var(--border)",
              borderRadius: "16px",
              padding: "1.25rem 1.5rem",
              boxShadow: "var(--shadow)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  backgroundColor: "var(--primary-dim)",
                  borderRadius: "8px",
                  padding: "6px",
                  color: "#0EA5E9",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <Layers size={16} />
              </div>
              <div>
                <span
                  style={{
                    color: "var(--text-2)",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                  }}
                >
                  Difficulty Stats Summary
                </span>
                <p
                  style={{
                    color: "var(--text-3)",
                    fontSize: "0.75rem",
                    marginTop: "2px",
                  }}
                >
                  Total questions distributed by difficulty level
                </p>
              </div>
            </div>
            <div
              className="w-full overflow-x-auto custom-scrollbar"
              style={{ paddingBottom: "6px" }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "2rem",
                  minWidth: "340px",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                {DIFF.map(({ key, label, color }) => (
                  <div
                    key={key}
                    style={{ textAlign: "center", minWidth: "56px" }}
                  >
                    <div style={{ color, fontWeight: 900, fontSize: "1.3rem" }}>
                      {grandTotals[key]}
                    </div>
                    <div
                      style={{
                        color: "var(--text-3)",
                        fontSize: "0.7rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginTop: "2px",
                      }}
                    >
                      {label}
                    </div>
                  </div>
                ))}
                <div style={{ textAlign: "center", minWidth: "56px" }}>
                  <div
                    style={{
                      color: "#0EA5E9",
                      fontWeight: 900,
                      fontSize: "1.3rem",
                    }}
                  >
                    {grandTotals.easy + grandTotals.medium + grandTotals.hard}
                  </div>
                  <div
                    style={{
                      color: "var(--text-3)",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      marginTop: "2px",
                    }}
                  >
                    Total
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}


export default function PaperBasics({
  data,
  onTotalQChange,
  onTotalMarksChange,
  onDurationChange,
  countOk,
  marksOk,
  allocatedCount,
  allocatedMarks,
}) {
  const labelStyle = {
    color: "var(--text-1)",
    fontSize: "0.68rem",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    display: "block",
    marginBottom: "5px",
  };
  const inputStyle = {
    width: "100%",
    backgroundColor: "var(--input-bg)",
    border: "1.5px solid var(--input-border)",
    borderRadius: "8px",
    padding: "7px 10px",
    fontSize: "0.95rem",
    fontWeight: 700,
    color: "var(--text-1)",
    outline: "none",
    transition: "all 0.2s",
  };

  const tq = data.totalQuestions === "" ? 0 : Number(data.totalQuestions);
  const tm = data.totalMarks === "" ? 0 : Number(data.totalMarks);

  return (
    <fieldset
      style={{
        border: "1.5px solid var(--border)",
        borderRadius: "14px",
        padding: "0",
        backgroundColor: "var(--card)",
        boxShadow: "var(--shadow)",
      }}
    >
      <legend
        style={{
          marginLeft: "14px",
          padding: "0 8px",
          color: "var(--text-3)",
          fontSize: "0.68rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.1em",
        }}
      >
        Paper Basics
      </legend>
      <div className="paper-basics-grid">
        {/* Total Questions */}
        <div>
          <label htmlFor="totalQuestionsInput" style={labelStyle}>
            Total Questions{" "}
            <sup style={{ color: "red", fontSize: "0.8rem" }}>*</sup>
          </label>
          <input
            id="totalQuestionsInput"
            type="number"
            min={0}
            max={500}
            value={data.totalQuestions}
            placeholder="e.g. 30"
            onChange={(e) =>
              onTotalQChange(
                e.target.value === ""
                  ? ""
                  : Math.max(0, Number(e.target.value)),
              )
            }
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#0EA5E9";
              e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--input-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        {/* Total Marks */}
        <div>
          <label htmlFor="totalMarksInput" style={labelStyle}>
            Total Marks<sup style={{ color: "red", fontSize: "0.8rem" }}>*</sup>
          </label>
          <input
            id="totalMarksInput"
            type="number"
            min={0}
            max={2000}
            value={data.totalMarks}
            placeholder="e.g. 100"
            onChange={(e) =>
              onTotalMarksChange(
                e.target.value === ""
                  ? ""
                  : Math.max(0, Number(e.target.value)),
              )
            }
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#0EA5E9";
              e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--input-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
        {/* Duration */}
        <div>
          <label htmlFor="durationInput" style={labelStyle}>
            Duration (min)
          </label>
          <input
            id="durationInput"
            type="number"
            min={0}
            max={600}
            value={data.duration ?? ""}
            placeholder="e.g. 90"
            onChange={(e) =>
              onDurationChange &&
              onDurationChange(
                e.target.value === ""
                  ? ""
                  : Math.max(0, Number(e.target.value)),
              )
            }
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.borderColor = "#0EA5E9";
              e.target.style.boxShadow = "0 0 0 3px rgba(14,165,233,0.15)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--input-border)";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>
      </div>
      {/* Status row */}
      <div
        style={{
          padding: "8px 18px",
          display: "flex",
          gap: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color:
              !countOk && tq > 0
                ? "#EF4444"
                : countOk && tq > 0
                  ? "#10B981"
                  : "var(--text-3)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
              display: "inline-block",
            }}
          />
          {tq > 0
            ? `Questions: ${allocatedCount} / ${tq}`
            : "Questions target not set"}
        </span>
        <span
          style={{
            fontSize: "0.75rem",
            fontWeight: 600,
            color:
              !marksOk && tm > 0
                ? "#EF4444"
                : marksOk && tm > 0
                  ? "#10B981"
                  : "var(--text-3)",
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          <span
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: "currentColor",
              display: "inline-block",
            }}
          />
          {tm > 0 ? `Marks: ${allocatedMarks} / ${tm}` : "Marks target not set"}
        </span>
      </div>
    </fieldset>
  );
}

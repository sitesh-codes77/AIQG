import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import useWizardStore from "../../store/useWizardStore";

const steps = [
  {
    title: "Curriculum Selection",
    description:
      "Define your class, choose curriculum standards, and select specific chapters or topics from the smart content library.",
  },
  {
    title: "Composition Setup",
    description:
      "Customize the perfect ratio of MCQs, short answers, and long answers along with marks weightage.",
  },
  {
    title: "Difficulty Distribution",
    description:
      "Distribute complexity levels (Easy, Medium, Hard) across chapters to match your desired test paper blueprint.",
  },
  {
    title: "AI Composition & Review",
    description:
      "Let AI synthesize and polish the questions, scan for duplicates, check for clarity, and output your print-ready paper.",
  },
  {
    title: "Paper Ready",
    description:
      "Your polished, exam-ready question paper is generated and available for instant download or preview.",
  },
];

function TimelineDot({ index, scrollProgress, isDark }) {
  const threshold = index * 0.25 + 0.12;
  const activeColor = isDark ? "#C0395A" : "#0EA5E9";
  const activeGlow = isDark ? "rgba(192,57,90,0.35)" : "rgba(14,165,233,0.3)";

  const color = useTransform(
    scrollProgress,
    [threshold - 0.08, threshold],
    ["var(--border)", activeColor],
  );
  const scale = useTransform(
    scrollProgress,
    [threshold - 0.08, threshold],
    [1, 1.25],
  );
  const glow = useTransform(
    scrollProgress,
    [threshold - 0.08, threshold],
    ["rgba(0,0,0,0)", activeGlow],
  );

  return (
    <div className="timeline-dot-wrapper">
      <motion.div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: color,
          border: "4px solid var(--canvas)",
          boxShadow: useTransform(glow, (val) => `0 0 12px ${val}`),
          scale: scale,
        }}
      />
    </div>
  );
}

export default function TimelineSection() {
  const containerRef = useRef(null);
  const isDark = useWizardStore((s) => s.isDark);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <section
      id="timeline-section"
      ref={containerRef}
      style={{
        padding: "6rem 1.5rem 8rem",
        maxWidth: "1100px",
        margin: "0 auto",
        width: "100%",
        position: "relative",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "5rem" }}>
        <h2
          style={{
            fontSize: "2.2rem",
            fontWeight: 800,
            color: "var(--text-1)",
            letterSpacing: "-0.02em",
            marginBottom: "0.8rem",
          }}
        >
          How It Works
        </h2>
        <p
          style={{
            color: "var(--text-3)",
            fontSize: "0.95rem",
            maxWidth: "480px",
            margin: "0 auto",
          }}
        >
          Generate balanced, high-quality assessment papers in a few simple
          steps.
        </p>
      </div>

      <div style={{ position: "relative", width: "100%" }}>
        {/* Background Track Line */}
        <div className="timeline-container-line" />

        {/* Animated Progress Line */}
        <motion.div className="timeline-progress-line" style={{ scaleY }} />

        <div style={{ display: "flex", flexDirection: "column", gap: "6rem" }}>
          {steps.map((item, idx) => {
            const isEven = idx % 2 === 0;
            return (
              <div
                key={idx}
                className="timeline-item"
                style={{
                  flexDirection: isEven ? "row" : "row-reverse",
                }}
              >
                {/* Timeline Card */}
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -45 : 45 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
                  className="timeline-card"
                  style={{
                    textAlign: isEven ? "right" : "left",
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontWeight: 800,
                      color: "var(--text-1)",
                      marginBottom: "0.5rem",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    {item.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--text-2)",
                      fontSize: "0.9rem",
                      lineHeight: "1.6",
                    }}
                  >
                    {item.description}
                  </p>
                </motion.div>

                {/* Central Circle Dot */}
                <TimelineDot
                  index={idx}
                  scrollProgress={scrollYProgress}
                  isDark={isDark}
                />

                {/* Empty side for layout spacing */}
                <div className="timeline-empty" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

import { useNavigate } from "react-router-dom";
import {
  Brain,
  Layers,
  Wand2,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import useWizardStore from "../store/useWizardStore";
import Rhero from "../assets/RHero.PNG";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import FeatureCard from "../components/landing/FeatureCard";
import TimelineSection from "../components/landing/TimelineSection";

const features = [
  {
    icon: Brain,
    title: "Smart Selection",
    description:
      "Intelligently curates questions based on curriculum standards, learning objectives, and cognitive levels.",
  },
  {
    icon: Layers,
    title: "Custom Composition",
    description:
      "Fine-tune MCQ, MSQ, short and long answer ratios. Set marks per question and target total score with precision.",
  },
  {
    icon: Wand2,
    title: "AI Review",
    description:
      "Automated review flags duplicate or ambiguous questions ensuring a polished, exam-ready paper every time.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const isDark = useWizardStore((s) => s.isDark);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* ── Navbar ── */}
      <Navbar variant="landing" />

      {/* ── Hero ── */}
      <main
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "1240px",
          margin: "0 auto",
          padding: "10rem 1rem 4rem",
          position: "relative",
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: "absolute",
            top: "5%",
            left: "15%",
            width: "500px",
            height: "500px",
            background: isDark
              ? "radial-gradient(circle,rgba(14,165,233,0.08) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(14,165,233,0.06) 0%,transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "15%",
            right: "10%",
            width: "400px",
            height: "400px",
            background: isDark
              ? "radial-gradient(circle,rgba(99,102,241,0.08) 0%,transparent 70%)"
              : "radial-gradient(circle,rgba(99,102,241,0.05) 0%,transparent 70%)",
            borderRadius: "50%",
            pointerEvents: "none",
          }}
        />

        <div
          className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 w-full"
          style={{ position: "relative", zIndex: 10 }}
        >
          {/* Left side: Text Content */}
          <div className="w-full lg:w-[48%] max-w-[500px] flex flex-col items-start text-left">
            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1, ease: "easeOut" }}
              style={{
                fontFamily: "'Plus Jakarta Sans', 'Noto Sans Math', sans-serif",
                fontSize: "2.1rem",
                fontWeight: 800,
                lineHeight: 1.25,
                letterSpacing: "-0.025em",
                marginBottom: "1.25rem",
                color: "var(--text-1)",
              }}
            >
              Intelligent Question Paper Generation.
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.25, ease: "easeOut" }}
              style={{
                color: "var(--text-2)",
                fontSize: "1.05rem",
                maxWidth: "500px",
                lineHeight: 1.6,
                marginBottom: "2rem",
                textAlign: "left",
              }}
            >
              Craft perfectly balanced exam papers in minutes. Select chapters,
              configure difficulty, and let AI compose a publication-ready
              question paper — every time.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.35, ease: "easeOut" }}
              style={{
                display: "flex",
                gap: "0.875rem",
                flexWrap: "wrap",
                justifyContent: "flex-start",
                width: "100%",
              }}
            >
              <button
                onClick={() => navigate("/login")}
                style={{
                  background:
                    "linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 80%,#000))",
                  color: "#fff",
                  border: "none",
                  borderRadius: "10px",
                  padding: "13px 28px",
                  fontSize: "0.95rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                  boxShadow:
                    "0 0 16px var(--primary-glow), 0 4px 20px var(--primary-dim)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 0 25px var(--primary-glow), 0 8px 28px var(--primary-dim)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "none";
                  e.currentTarget.style.boxShadow =
                    "0 0 16px var(--primary-glow), 0 4px 20px var(--primary-dim)";
                }}
              >
                Start Generating <ArrowRight size={17} />
              </button>
              <button
                onClick={() => {
                  document
                    .getElementById("timeline-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                style={{
                  background: "transparent",
                  color: "var(--text-2)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "10px",
                  padding: "13px 28px",
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--text-2)";
                  e.currentTarget.style.color = "var(--text-1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--border)";
                  e.currentTarget.style.color = "var(--text-2)";
                }}
              >
                Watch Demo
              </button>
            </motion.div>
          </div>

          {/* Right side: Hero Image with Floating Animation */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.35, ease: "easeOut" }}
            className="w-full lg:w-[42%] max-w-[400px] flex justify-center items-center p-4 lg:p-6"
          >
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                repeatType: "mirror",
              }}
              className="relative w-full"
            >
              {/* Gradient ambient glow detrás de la imagen */}
              <div
                className="absolute -inset-4 rounded-3xl opacity-20 dark:opacity-30 blur-2xl"
                style={{
                  background:
                    "linear-gradient(135deg, #0EA5E9, #818CF8, #10B981)",
                  zIndex: 0,
                }}
              />

              {/* La imagen */}
              <img
                src={Rhero}
                alt="AI Question Paper Generator Dashboard"
                className="w-full h-auto rounded-2xl shadow-[0_20px_50px_rgba(14,165,233,0.15)] dark:shadow-[0_20px_50px_rgba(14,165,233,0.3)] border border-slate-200/50 dark:border-slate-800/50 relative z-10"
                style={{
                  display: "block",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* ── Stats Section ── */}
      <div
        style={{
          width: "100%",
          maxWidth: "700px",
          margin: "0 auto 4rem",
          padding: "0 1rem",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "2.5rem",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          {[
            { value: "10,000+", label: "Papers Generated" },
            { value: "500+", label: "Institutions" },
            { value: "98%", label: "Satisfaction Rate" },
          ].map((s) => (
            <div
              key={s.label}
              style={{
                textAlign: "center",
                flex: "0 1 auto",
                minWidth: "120px",
              }}
            >
              <div
                style={{
                  fontSize: "1.7rem",
                  fontWeight: 800,
                  color: "var(--primary)",
                  letterSpacing: "-0.02em",
                }}
              >
                {s.value}
              </div>
              <div
                style={{
                  color: "var(--text-3)",
                  fontSize: "0.82rem",
                  marginTop: "2px",
                  fontWeight: 500,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section
        style={{
          padding: "0 1rem 5rem",
          maxWidth: "1240px",
          margin: "0 auto",
          width: "100%",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "3rem" }}
        >
          <h2
            style={{
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "var(--text-1)",
              letterSpacing: "-0.02em",
              marginBottom: "0.6rem",
            }}
          >
            Everything you need to create great exams
          </h2>
          <p
            style={{
              color: "var(--text-3)",
              fontSize: "0.95rem",
              maxWidth: "460px",
              margin: "0 auto",
            }}
          >
            A complete toolkit built for educators who demand precision and
            efficiency.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
            gap: "1.25rem",
          }}
        >
          {features.map((f) => (
            <FeatureCard key={f.title} {...f} />
          ))}
        </motion.div>
      </section>

      {/* ── Timeline Section ── */}
      <TimelineSection />

      {/* ── Footer ── */}
      <Footer />
    </div>
  );
}

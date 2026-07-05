import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  NotebookText,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ThemeToggle from "../components/ThemeToggle";
import useAuthStore from "../store/useAuthStore";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [focused, setFocused] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) clearError();
    if (validationError) setValidationError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setValidationError("Please enter a valid email address");
      return;
    }
    if (form.password.length < 1) {
      setValidationError("Password is required");
      return;
    }

    const result = await login({
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });

    if (result.success) {
      navigate("/generator");
    }
  };

  const displayError = validationError || error;

  const inputStyle = (field) => ({
    width: "100%",
    backgroundColor: "var(--input-bg)",
    border: `1.5px solid ${
      focused === field ? "var(--primary)" : "var(--input-border)"
    }`,
    borderRadius: "10px",
    padding: "11px 14px 11px 42px",
    color: "var(--text-1)",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxShadow:
      focused === field ? "0 0 0 3px var(--primary-dim)" : "none",
    fontFamily: "inherit",
  });

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "var(--canvas)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top bar with theme toggle */}
      <div
        style={{
          position: "absolute",
          top: "1rem",
          right: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          zIndex: 10,
        }}
      >
        <ThemeToggle />
      </div>
      <button
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "1.2rem",
          left: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "var(--text-3)",
          fontSize: "0.83rem",
          fontWeight: 500,
          cursor: "pointer",
          transition: "color 0.2s",
          zIndex: 10,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--primary)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-3)")
        }
      >
        ← Back to Home
      </button>

      {/* Background glows */}
      <div
        style={{
          position: "fixed",
          top: "-10%",
          left: "-5%",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle,rgba(14,165,233,0.06) 0%,transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: "-10%",
          right: "-5%",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle,rgba(129,140,248,0.06) 0%,transparent 65%)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* Centered card */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "2rem",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          style={{
            backgroundColor: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: "20px",
            padding: "2.25rem",
            width: "100%",
            maxWidth: "430px",
            boxShadow: "var(--shadow)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Card header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "1.1rem",
              }}
            >
              <NotebookText size={22} color="var(--primary)" />
              <span
                style={{
                  fontWeight: 800,
                  fontSize: "1.2rem",
                  background: "linear-gradient(90deg, var(--primary), var(--indigo))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                AIQG
              </span>
            </div>
            <h1
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                color: "var(--text-1)",
                letterSpacing: "-0.02em",
                marginBottom: "0.4rem",
              }}
            >
              Welcome Back
            </h1>
            <p style={{ color: "var(--text-3)", fontSize: "0.875rem" }}>
              Sign in to access the Question Generator
            </p>
          </div>

          <div
            style={{
              height: "1px",
              backgroundColor: "var(--border)",
              marginBottom: "1.75rem",
            }}
          />

          {/* Error message */}
          <AnimatePresence>
            {displayError && (
              <motion.div
                initial={{ opacity: 0, y: -8, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, y: -8, height: 0 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "10px 14px",
                  backgroundColor: "var(--danger-dim)",
                  border: "1px solid rgba(239,68,68,0.2)",
                  borderRadius: "10px",
                  marginBottom: "1.1rem",
                  color: "var(--danger)",
                  fontSize: "0.83rem",
                  fontWeight: 500,
                }}
              >
                <AlertCircle size={15} style={{ flexShrink: 0 }} />
                {displayError}
              </motion.div>
            )}
          </AnimatePresence>

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  color: "var(--text-3)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  marginBottom: "5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={15}
                  color={
                    focused === "email" ? "var(--primary)" : "var(--text-3)"
                  }
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                  style={inputStyle("email")}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  color: "var(--text-3)",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  marginBottom: "5px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  color={
                    focused === "password"
                      ? "var(--primary)"
                      : "var(--text-3)"
                  }
                  style={{
                    position: "absolute",
                    left: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    transition: "color 0.2s",
                  }}
                />
                <input
                  id="password"
                  type={showPw ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onFocus={() => setFocused("password")}
                  onBlur={() => setFocused("")}
                  style={{ ...inputStyle("password"), paddingRight: "42px" }}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute",
                    right: "13px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-3)",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                    transition: "color 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--primary)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-3)")
                  }
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              id="loginBtn"
              type="submit"
              disabled={isLoading}
              style={{
                width: "100%",
                background: isLoading
                  ? "var(--border)"
                  : "linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 80%,#000))",
                color: "#fff",
                border: "none",
                borderRadius: "10px",
                padding: "13px",
                fontSize: "0.95rem",
                fontWeight: 700,
                cursor: isLoading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "7px",
                boxShadow: isLoading
                  ? "none"
                  : "0 4px 18px var(--primary-dim)",
                transition: "all 0.2s",
                marginTop: "0.4rem",
                opacity: isLoading ? 0.7 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow =
                    "0 8px 24px var(--primary-glow)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "none";
                e.currentTarget.style.boxShadow = isLoading
                  ? "none"
                  : "0 4px 18px var(--primary-dim)";
              }}
            >
              {isLoading ? (
                <>
                  <Loader2
                    size={17}
                    style={{ animation: "spin 1s linear infinite" }}
                  />
                  Signing In...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={17} />
                </>
              )}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              color: "var(--text-3)",
              fontSize: "0.8rem",
              marginTop: "1.35rem",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              style={{
                color: "var(--primary)",
                fontWeight: 600,
                textDecoration: "none",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.textDecoration = "underline")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.textDecoration = "none")
              }
            >
              Sign Up
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

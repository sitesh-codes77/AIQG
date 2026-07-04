export default function FeatureCard({ icon: Icon, title, description }) {
  return (
    <div
      style={{
        backgroundColor: "var(--card)",
        border: "1px solid var(--border)",
        borderRadius: "16px",
        padding: "1.75rem",
        transition: "all 0.28s ease",
        cursor: "default",
        textAlign: "center",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "var(--primary)";
        e.currentTarget.style.transform = "translateY(-8px)";
        e.currentTarget.style.boxShadow = "0 20px 35px var(--primary-glow)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "var(--border)";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: "46px",
          height: "46px",
          borderRadius: "12px",
          backgroundColor: "var(--primary-dim)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 1.1rem",
          border: "1px solid var(--primary-glow)",
        }}
      >
        <Icon size={20} color="var(--primary)" />
      </div>
      <h3
        style={{
          fontSize: "1.05rem",
          fontWeight: 700,
          color: "var(--text-1)",
          marginBottom: "0.6rem",
        }}
      >
        {title}
      </h3>
      <p
        style={{
          color: "var(--text-3)",
          fontSize: "0.875rem",
          lineHeight: 1.6,
        }}
      >
        {description}
      </p>
    </div>
  )
}

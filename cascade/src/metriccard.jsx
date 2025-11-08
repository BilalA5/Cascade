// src/components/MetricCard.jsx
import React from "react";
import "./theme.css";

export default function MetricCard({ label, value, description, icon: Icon }) {
  return (
    <div className="card" style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700 }}>
        {Icon && <Icon size={18} color="var(--highlight)" />}
        {label}
      </div>

      <div style={{ fontSize: "38px", fontWeight: 800 }}>
        {value}
      </div>

      {description && (
        <div style={{ color: "var(--text-subtle)", fontSize: "14px", lineHeight: "1.4" }}>
          {description}
        </div>
      )}
    </div>
  );
}

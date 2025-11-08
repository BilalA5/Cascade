// src/components/MetricCard.jsx
import React from "react";
import "./theme.css";

export default function MetricCard({ label, value, description, icon: Icon }) {
  return (
    <div className="card" style={{ textAlign: "center", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontWeight: 700 }}>
        {Icon && <Icon size={18} color="var(--highlight)" />}
        {label}
      </div>

      <div style={{ fontSize: "38px", fontWeight: 800, marginTop: "6px" }}>
        {value}
      </div>

      <div style={{ color: "var(--text-subtle)", fontSize: "14px", marginTop: "4px" }}>
        {description}
      </div>
    </div>
  );
}
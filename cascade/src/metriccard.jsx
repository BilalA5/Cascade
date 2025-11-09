// src/components/MetricCard.jsx
import React from "react";
import "./theme.css";

export default function MetricCard({ label, value, description, icon: Icon }) {
  return (
    <div className="card" style={{ textAlign: "center", alignItems: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", fontWeight: 700 }}>
        {/* UPDATED ICON COLOR */}
        {Icon && <Icon size={18} color="#FFFFFF" />}
        {label}
      </div>

      <div style={{ fontSize: "38px", fontWeight: 800, marginTop: "6px" }}>
        {value}
      </div>

      <div style={{ color: "#B2DFDB", fontSize: "14px", marginTop: "4px" }}>
        {description}
      </div>
    </div>
  );
}
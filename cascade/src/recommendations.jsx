// src/recommendations.jsx
import React from "react";
import "./theme.css";

export default function Recommendations({ recs }) {
  return (
    <div>
      <h2 className="section-title">🤖 AI Recommendations</h2>
      <div className="grid-2" style={{ gap: "20px" }}>
        {recs.map((rec, index) => (
          <div key={index} className="card">
            <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>{rec.title}</h3>
            <p style={{ color: "var(--text-subtle)", lineHeight: "1.5" }}>
              {rec.body}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

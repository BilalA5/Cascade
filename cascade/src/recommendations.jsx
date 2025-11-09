// src/recommendations.jsx
import React from "react";
import "./theme.css";

const gradients = [
  'linear-gradient(135deg, #004d40 0%, #00796b 50%, #00bfa5 100%)',
  'linear-gradient(135deg, #003b3b 0%, #005f56 60%, #26a69a 100%)',
  'linear-gradient(135deg, #003020 0%, #00695c 55%, #29d3c4 100%)',
  'linear-gradient(135deg, #003d2f 0%, #008060 60%, #5de1c5 100%)',
]

export default function Recommendations({ recs }) {
  return (
    <div>
      <h2 className="section-title">AI Recommendations for Farming Optimization</h2>
      <div className="grid-2" style={{ gap: "20px" }}>
        {recs.map((rec, index) => (
          <div
            key={index}
            className="card insight-card"
            style={{
              background: gradients[index % gradients.length],
              border: '1px solid rgba(255, 255, 255, 0.08)',
              boxShadow: '0px 18px 30px rgba(0, 60, 60, 0.35)',
            }}
          >
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

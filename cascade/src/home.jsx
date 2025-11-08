import React from "react";
import Button from "./button.jsx";
import MetricCard from "./metriccard.jsx";
import "./theme.css";
import { Droplets, Leaf, FlaskConical, Bug } from "lucide-react";

export default function Home({ onGenerate, latestSnapshot }) {
  const { ndmi, ndvi, ph, pestRisk } = latestSnapshot;

  return (
    <div className="container" style={{ paddingTop: "60px", textAlign: "center" }}>
      
      {/* Hero Section */}
      <h1 style={{ fontSize: "38px", fontWeight: "700", marginBottom: "12px" }}>
        Grow Smarter with AI Sensor Sustainability
      </h1>

      <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "17px", lineHeight: "1.6", color: "var(--text-subtle)" }}>
        Cascade analyzes your real crop & soil through AI backed sensors to generate accurate,
        real time field health reports tailored for sustainability recommendations.
      </p>

      <Button
        variant="primary"
        onClick={onGenerate}
        style={{ marginTop: "32px", fontSize: "22px", padding: "16px 40px", borderRadius: "18px" }}
      >
        Generate Report
      </Button>

      {/* **New Plant Animation** */}
      <div style={{ marginTop: "40px" }}>
        <img
          src="https://lottie.host/90b961bc-04fa-4d11-a58d-88e73613c0d6/y0xw2tqn9P.json"
          alt="Plant Animation"
          style={{ width: "220px", filter: "drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.35))" }}
        />
      </div>

      {/* Metrics */}
      <div className="grid-4 metrics-section" style={{ marginTop: "50px" }}>
        <MetricCard label="NDMI (Moisture)" value={ndmi} description="Root zone water availability" icon={Droplets} />
        <MetricCard label="NDVI (Vegetation)" value={ndvi} description="Photosynthetic vigor" icon={Leaf} />
        <MetricCard label="Soil pH" value={ph} description="Nutrient absorption readiness" icon={FlaskConical} />
        <MetricCard label="Pest Risk" value={Math.round(pestRisk * 100) + "%"} description="Outbreak likelihood" icon={Bug} />
      </div>

    </div>
  );
}

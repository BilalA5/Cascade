// src/pages/Home.jsx
import React from "react";
import Button from "./button.jsx";
import MetricCard from "./metriccard.jsx";
import "./theme.css";

// Icons (Install: npm i lucide-react)
import { Droplets, Leaf, FlaskConical, Bug } from "lucide-react";

export default function Home({ onGenerate, latestSnapshot }) {
  const { ndmi, ndvi, ph, pestRisk } = latestSnapshot;

  return (
    <div className="container" style={{ paddingTop: "50px" }}>
      {/* Hero Section */}
      <div style={{ marginBottom: "55px", maxWidth: "700px" }}>
        <h1 style={{ fontSize: "42px", fontWeight: 800, lineHeight: 1.1 }}>
          Grow Smarter with Sensor-Driven Sustainability
        </h1>

        <p style={{ color: "var(--text-subtle)", marginTop: "16px", fontSize: "17px" }}>
          Cascade analyzes real sensor data + vegetation indices to produce
          high-accuracy soil moisture, plant health, and pest risk reports.
          Receive actionable AI recommendations tailored to your environment.
        </p>

        <Button
          variant="primary"
          onClick={onGenerate}
          style={{ marginTop: "32px", fontSize: "16px" }}
        >
          Generate Report
        </Button>
      </div>

      {/* Quick Preview Metrics */}
      <div className="grid-4" style={{ marginTop: "20px" }}>
        <MetricCard
          label="NDMI (Moisture)"
          value={ndmi}
          description="Root zone water availability"
          icon={Droplets}
        />

        <MetricCard
          label="NDVI (Greenness)"
          value={ndvi}
          description="Overall vegetation vigor"
          icon={Leaf}
        />

        <MetricCard
          label="Soil pH"
          value={ph}
          description="Nutrient absorption readiness"
          icon={FlaskConical}
        />

        <MetricCard
          label="Pest Risk"
          value={pestRisk * 100 + "%"}
          description="Likelihood of upcoming outbreak"
          icon={Bug}
        />
      </div>
    </div>
  );
}

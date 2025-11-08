// src/pages/Report.jsx
import React from "react";
import MetricCard from "./metriccard.jsx";
import SensorChart from "./sensorchart.jsx";
import Recommendations from "./recommendations.jsx";
import Button from "./button.jsx"; // Import Button
import { Droplets, Leaf, FlaskConical, Bug } from "lucide-react";
import { generateRecommendations } from "./generateRecommendations.jsx";
import "./theme.css";

// Include onBack in destructuring
export default function Report({ snapshot, historyData, onBack }) {
  const { ndmi, ndvi, ph, pestRisk, moisture } = snapshot;

  const recs = generateRecommendations({
    ndmi,
    ndvi,
    ph,
    pestRisk,
    moisture
  });

  return (
    <div className="container" style={{ paddingTop: "45px" }}>

      {/* **BACK BUTTON** */}
      <Button
        onClick={onBack}
        style={{ marginBottom: "25px", padding: "10px 20px", fontSize: "16px" }}
        variant="secondary" 
      >
        ← Back to Home
      </Button>
      {/* Section Title */}
      <h2 className="section-title">Farm Health Report</h2>

      {/* Primary Metrics */}
      <div className="grid-4" style={{ marginTop: "20px" }}>
        <MetricCard
          label="NDMI (Soil Moisture)"
          value={ndmi}
          description="Water stored in root zone"
          icon={Droplets}
        />

        <MetricCard
          label="NDVI (Greenness)"
          value={ndvi}
          description="Plant energy & health"
          icon={Leaf}
        />

        <MetricCard
          label="Soil pH"
          value={ph}
          description="Nutrient availability"
          icon={FlaskConical}
        />

        <MetricCard
          label="Pest Risk"
          value={Math.round(pestRisk * 100) + "%"}
          description="Projected 48h outbreak probability"
          icon={Bug}
        />
      </div>

      {/* Trend Charts */}
      <div className="grid-2" style={{ marginTop: "30px" }}>
        <SensorChart
          data={historyData}
          dataKey="moisture"
          label="Soil Moisture Trend (Last 24h)"
        />

        <SensorChart
          data={historyData}
          dataKey="ndvi"
          label="NDVI Vegetation Trend"
        />
      </div>

      {/* AI RECOMMENDATIONS */}
      <div style={{ marginTop: "40px" }}>
        <Recommendations recs={recs} />
      </div>

    </div>
  );
}
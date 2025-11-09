// src/pages/Report.jsx
import React from "react";
import MetricCard from "./metriccard.jsx";
import SensorChart from "./sensorchart.jsx";
import Recommendations from "./recommendations.jsx";
import Button from "./button.jsx"; 
import { Droplets, HeartPulse, FlaskConical, Bug } from "lucide-react";
import "./theme.css";

export default function Report({
  snapshot,
  historyData,
  onBack,
  loading,
  insightsError,
  recommendations,
}) {
  const {
    ndmiDisplay,
    healthScore,
    ph,
    pestRisk,
    pestPercent,
    moisture,
    moistureDetail,
    pestDetail,
    healthDetail,
  } = snapshot;

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
          value={loading ? "…" : ndmiDisplay}
          description="Water stored in root zone"
          icon={Droplets}
          detail={moistureDetail}
        />

        <MetricCard 
            label="Plant Health Score" 
            value={loading ? "…" : Math.round(healthScore || 0) + "/100"}
            description="Overall crop vigor and resilience" 
            icon={HeartPulse}
            detail={healthDetail}
        />

        <MetricCard
          label="Soil pH"
          value={loading ? "…" : ph}
          description="Nutrient availability"
          icon={FlaskConical}
        />

        <MetricCard
          label="Pest Risk"
          value={
            loading
              ? "…"
              : `${Math.round(
                  pestPercent ?? (pestRisk || 0) * 100,
                )}%`
          }
          description="Projected 48h outbreak probability"
          icon={Bug}
          detail={pestDetail}
        />
      </div>

      {/* Trend Charts */}
      <div className="grid-2" style={{ marginTop: "30px" }}>
        <SensorChart
          data={historyData}
          dataKey="moisture"
          label="Soil Moisture Trend (Last 24h)"
          loading={loading}
        />

        <SensorChart
          data={historyData}
          dataKey="healthScore"
          label="Plant Health Score Trend" 
          loading={loading}
        />
      </div>

      {/* AI RECOMMENDATIONS */}
      <div style={{ marginTop: "40px" }}>
        {insightsError && (
          <div className="card" style={{ marginBottom: "16px" }}>
            <h3 style={{ fontSize: "18px", marginBottom: "8px" }}>AI insight unavailable</h3>
            <p style={{ color: "var(--text-subtle)" }}>
              Gemini could not generate a response. Showing fallback guidance based on field thresholds.
            </p>
          </div>
        )}
        <Recommendations recs={recommendations} />
      </div>
    </div>
  );
}
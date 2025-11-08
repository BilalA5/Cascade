// src/pages/home.jsx
import React from "react";
import Button from "./button.jsx";
import MetricCard from "./metriccard.jsx";
import LiquidEther from './LiquidEther'; 
import "./theme.css";
import { Droplets, Leaf, FlaskConical, Bug } from "lucide-react";

export default function Home({ onGenerate, latestSnapshot }) {
  const { ndmi, ndvi, ph, pestRisk } = latestSnapshot;

  return (
    <> {/* Use Fragment to wrap the two top-level divs */}
      
      {/* 1. Full-screen LiquidEther Background */}
      <div 
        style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          overflow: 'hidden', 
          zIndex: 0 // Place behind the content
        }}
      >
        <LiquidEther
          // Hazel Yellow Colors
          colors={['#DDA35A', '#EED295', '#B8860B']}
          mouseForce={20}
          cursorSize={100}
          isViscous={false}
          viscous={30}
          iterationsViscous={32}
          iterationsPoisson={32}
          resolution={0.5}
          isBounce={false}
          autoDemo={true}
          autoSpeed={0.5}
          autoIntensity={2.2}
          takeoverDuration={0.25}
          autoResumeDelay={3000}
          autoRampDuration={0.6}
        />
      </div>

      {/* 2. Main Content (The centered, scrollable part) */}
      <div className="container" style={{ paddingTop: "60px", textAlign: "center", position: "relative", zIndex: 1 }}>
        
        {/* Hero Content */}
        <div style={{ paddingBottom: '30px' }}>
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

          {/* PLANT ANIMATION REMOVED HERE */}

        </div>

        {/* Metrics */}
        <div className="grid-4 metrics-section" style={{ marginTop: "50px" }}>
          <MetricCard label="NDMI (Moisture)" value={ndmi} description="Root zone water availability" icon={Droplets} />
          <MetricCard label="NDVI (Vegetation)" value={ndvi} description="Photosynthetic vigor" icon={Leaf} />
          <MetricCard label="Soil pH" value={ph} description="Nutrient absorption readiness" icon={FlaskConical} />
          <MetricCard label="Pest Risk" value={Math.round(pestRisk * 100) + "%"} description="Outbreak likelihood" icon={Bug} />
        </div>

      </div>
    </>
  );
}
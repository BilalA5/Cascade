// src/pages/home.jsx
import React from "react";
import Button from "./button.jsx";
import MetricCard from "./metriccard.jsx";
import LiquidEther from './LiquidEther'; 
import "./theme.css";
// I'm changing 'Leaf' to 'HeartPulse' for a health-related icon (you might need to install 'lucide-react')
// If you prefer the old Leaf icon, you can change 'HeartPulse' back to 'Leaf'
import { Droplets, HeartPulse, FlaskConical, Bug } from "lucide-react"; 

export default function Home({ onGenerate, latestSnapshot }) {
  //  UPDATED: Replaced 'ndvi' with 'healthScore' in destructuring
  const { ndmi, healthScore, ph, pestRisk } = latestSnapshot; 

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
          // **UPDATED TO DARK GREEN/WHITE SHADES**
          colors={['#004D40', '#00796B', '#FFFFFF']}
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
            Grow Smarter with CASCADE
          </h1>

          <p style={{ maxWidth: "650px", margin: "0 auto", fontSize: "17px", lineHeight: "1.6", color: "#004D00" }}>
            Cascade analyzes your real crop & soil through AI backed sensors to generate accurate,
            real time field health reports tailored for sustainability
          </p>

          <div style={{ maxWidth: '600px', margin: '40px auto 0 auto' }}>
            <Button
              variant="ghost" 
              onClick={onGenerate}
              style={{ 
                  width: '100%', 
                  fontSize: "24px", 
                  padding: "20px 0px", 
                  borderRadius: "18px",
              }}
            >
              Generate Report
            </Button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid-4 metrics-section" style={{ marginTop: "50px" }}>
          <MetricCard label="NDMI (Moisture)" value={ndmi} description="Root zone water availability" icon={Droplets} />
          {/* 💡 UPDATED: Replaced NDVI card with Plant Health Score card */}
          <MetricCard 
            label="Plant Health Score" 
            value={Math.round(healthScore) + "/100"} // Assuming healthScore is a number out of 100
            description="Overall crop vigor and resilience" 
            icon={HeartPulse} // Changed icon to one that signifies health
          />
          <MetricCard label="Soil pH" value={ph} description="Nutrient absorption readiness" icon={FlaskConical} />
          <MetricCard label="Pest Risk" value={Math.round(pestRisk * 100) + "%"} description="Outbreak likelihood" icon={Bug} />
        </div>

      </div>
    </>
  );
}
// src/App.jsx
import React, { useState } from "react";
import Home from "./home.jsx";
import Report from "./report.jsx";
import { calculateIndices } from "./calculateindices.jsx"; 
import "./theme.css";

export default function App() {
  const [showReport, setShowReport] = useState(false);

  // Example raw inputs (replace these later with real sensor values)
  const rawSensorData = {
    nir: 0.72,         // Near Infrared reflectance
    red: 0.35,        // Red band reflectance
    swir: 0.60,       // Short-Wave Infrared reflectance
    soilPH: 6.5,      // Soil pH probe
    pestScoreRaw: 0.42, // Pest classifier output (0-1)
    moisturePercent: 18 // Capacitive soil moisture sensor
  };

  // Convert raw sensor values → NDMI, healthScore, etc.
  // NOTE: 'snapshot' object must now contain 'healthScore' instead of 'ndvi'
  const snapshot = calculateIndices(rawSensorData);

  // Historical time-series data for charts (fake demo data here)
  const historyData = [
    // UPDATED: Changed 'ndvi' key to 'healthScore' and scaled the values to 0-100
    { time: "09:00", moisture: 22, healthScore: 55 },
    { time: "10:00", moisture: 21, healthScore: 57 },
    { time: "11:00", moisture: 19, healthScore: 58 },
    { time: "12:00", moisture: 18, healthScore: 61 },
    { time: "13:00", moisture: 16, healthScore: 59 },
    { time: "14:00", moisture: 15, healthScore: 56 },
  ];

  return (
    <div className="app-container">
      {showReport ? (
        <Report
          snapshot={snapshot}
          historyData={historyData}
          onBack={() => setShowReport(false)}
        />
      ) : (
        <Home
          latestSnapshot={snapshot}
          onGenerate={() => setShowReport(true)}
        />
      )}
    </div>
  );
}
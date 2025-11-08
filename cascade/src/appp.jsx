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

  // Convert raw sensor values → NDVI, NDMI, etc.
  const snapshot = calculateIndices(rawSensorData);

  // Historical time-series data for charts (fake demo data here)
  const historyData = [
    { time: "09:00", moisture: 22, ndvi: 0.55 },
    { time: "10:00", moisture: 21, ndvi: 0.57 },
    { time: "11:00", moisture: 19, ndvi: 0.58 },
    { time: "12:00", moisture: 18, ndvi: 0.61 },
    { time: "13:00", moisture: 16, ndvi: 0.59 },
    { time: "14:00", moisture: 15, ndvi: 0.56 },
  ];

  return (
    <>
      {/* If user has not generated yet → show Home */}
      {!showReport && (
        <Home
          onGenerate={() => setShowReport(true)}
          latestSnapshot={snapshot}
        />
      )}

      {/* After user clicks Generate → show Report */}
      {showReport && (
        <Report
          snapshot={snapshot}
          historyData={historyData}
        />
      )}
    </>
  );
}

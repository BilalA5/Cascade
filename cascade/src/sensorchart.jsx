// src/components/SensorChart.jsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./theme.css";

export default function SensorChart({ data, dataKey, label }) {
  return (
    <div className="card" style={{ height: "260px", display: "flex", flexDirection: "column" }}>
      <div style={{ fontWeight: 700, marginBottom: "12px" }}>
        {label}
      </div>

      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            {/* UPDATED: Axis color changed to light for contrast against dark green card background */}
            <XAxis dataKey="time" stroke="#B2DFDB" fontSize={12} />
            <YAxis stroke="#B2DFDB" fontSize={12} />
            <Tooltip
              contentStyle={{
                // Tooltip background remains light panel color and text is dark green
                background: "var(--panel)", 
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-main)" 
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="#FFFFFF" // Line color is white for visibility
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
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
            <XAxis dataKey="time" stroke="var(--text-subtle)" fontSize={12} />
            <YAxis stroke="var(--text-subtle)" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "var(--panel)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                color: "var(--text-main)"
              }}
            />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke="var(--highlight)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 
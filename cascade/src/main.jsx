// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./appp.jsx";
import "./theme.css"; // Ensure global theme is applied

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// src/components/Button.jsx
import React from "react";
import "./theme.css";

export default function Button({ children, onClick, variant = "primary", style = {}, ...props }) {
  const base = "btn";
  const type = variant === "primary" ? "btn-primary" : "";

  return (
    <button
      className={`${base} ${type}`}
      onClick={onClick}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}

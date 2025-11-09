// src/components/Button.jsx
import React from "react";
import "./theme.css";

export default function Button({ children, onClick, variant = "primary", style = {}, ...props }) {
  const base = "btn";
  let type = "";
  if (variant === "primary") {
    type = "btn-primary";
  } else if (variant === "secondary") {
    type = "btn-secondary";
  } else if (variant === "ghost") {
    type = "btn-ghost";
  }

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
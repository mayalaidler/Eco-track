import React from "react";
import "../styles/GridEffect.css";

export default function GridBackground() {
  const tiles = Array.from({ length: 100 });

  return (
    <div className="grid-bg">
      {tiles.map((_, i) => (
        <div key={i} className="grid-tile" />
      ))}
    </div>
  );
}
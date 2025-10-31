import React from "react";

const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
  DEFAULT: "#4b3f2f",
};

const FacilityPopup = ({ facility, entities, handlePin }) => {
  return (
    <div
      style={{
        minWidth: "250px",
        maxWidth: "400px",
        backgroundColor: "#fffaf0",
        border: "1px solid #c2b280",
        padding: "1rem",
        borderRadius: "6px",
        fontFamily: "Georgia, serif",
        color: "#3e3e3e",
      }}
    >
      <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#5c4b3b" }}>
        🏛️ <em>{facility.text}</em>
      </h3>
      <button
        onClick={() => handlePin(facility)}
        style={{
          marginTop: "0.5rem",
          backgroundColor: "#c2b280",
          border: "none",
          padding: "0.4rem 0.8rem",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: "pointer",
          fontFamily: "Georgia, serif",
          color: "#3e3e3e",
        }}
        aria-label={`Pin facility ${facility?.text}`}
      >
        📌 Pin this Facility
      </button>
      <details style={{ marginTop: "0.75rem" }}>
        <summary
          style={{
            cursor: "pointer",
            fontWeight: "bold",
            fontSize: "0.95rem",
            color: "#6b4226",
          }}
        >
          Reveal associated entities
        </summary>
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
          {entities.map((ent, j) => {
            const color = labelColors[ent.label] || labelColors.DEFAULT;
            return (
              <li key={j} style={{ marginBottom: "0.4rem" }}>
                <span
                  style={{
                    backgroundColor: color,
                    color: "#fdf6e3",
                    padding: "0.25rem 0.6rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    fontFamily: "Georgia, serif",
                    marginRight: "0.5rem",
                    display: "inline-block",
                    minWidth: "60px",
                    textAlign: "center",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {ent.label}
                </span>
                <span style={{ fontSize: "0.9rem" }}>{ent.text}</span>
              </li>
            );
          })}
        </ul>
      </details>
    </div>
  );
};

export default FacilityPopup;

import React from "react";

const labelColors = {
  ORG: "#d97706",
  DATE: "#2563eb",
  GPE: "#059669",
  PERSON: "#db2777",
  EVENT: "#7c3aed",
  FACILITY: "#f43f5e",
  DEFAULT: "#6b7280",
};

const FacilityPopup = ({ facility, entities }) => {
  return (
    <div style={{ minWidth: "250px", maxWidth: "400px" }}>
      <strong>{facility.text}</strong>
      <details style={{ marginTop: "0.5rem" }}>
        <summary style={{ cursor: "pointer", fontWeight: "bold" }}>View all entities</summary>
        <ul style={{ listStyle: "none", paddingLeft: 0, marginTop: "0.5rem" }}>
          {entities.map((ent, j) => {
            const color = labelColors[ent.label] || labelColors.DEFAULT;
            return (
              <li key={j} style={{ marginBottom: "0.3rem" }}>
                <span
                  style={{
                    backgroundColor: color,
                    color: "white",
                    padding: "0.2rem 0.5rem",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    marginRight: "0.4rem",
                    display: "inline-block",
                    minWidth: "50px",
                    textAlign: "center",
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
}

export default FacilityPopup;

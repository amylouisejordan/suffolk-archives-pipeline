import React from "react";

const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
};

const EntityLegend = () => {
  return (
    <section
      aria-label="Entity type legend"
      style={{
        marginBottom: "1.5rem",
        fontFamily: "Georgia, serif",
        textAlign: "center",
      }}
    >
      <div
        role="list"
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "0.5rem",
        }}
      >
        {Object.entries(labelColors).map(([label, color]) => (
          <span
            key={label}
            role="listitem"
            aria-label={`Entity type ${label}`}
            style={{
              backgroundColor: color,
              color: "#fdf6e3",
              padding: "0.3rem 0.6rem",
              borderRadius: "4px",
              fontSize: "0.85rem",
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "60px",
              height: "28px",
              textAlign: "center",
              transition: "transform 0.2s ease",
              cursor: "default",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            {label}
          </span>
        ))}
      </div>
    </section>
  );
};

export default EntityLegend;

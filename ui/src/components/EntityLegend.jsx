import React from "react";
import { motion } from "framer-motion";

const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
};

const labelDescriptions = {
  ORG: "An organization or institution",
  DATE: "A specific date or time reference",
  GPE: "A geopolitical entity (e.g. city, country)",
  PERSON: "A named individual",
  EVENT: "A historical or named event",
  FACILITY: "A named building or site",
};

const EntityLegend = ({ show }) => {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "0.5rem",
        marginBottom: "1rem",
        fontFamily: "Georgia, serif",
      }}
    >
      {Object.entries(labelColors).map(([label, color], i) => (
        <motion.span
          key={label}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          title={labelDescriptions[label]}
          style={{
            backgroundColor: color,
            color: "#fdf6e3",
            padding: "0.3rem 0.6rem",
            borderRadius: "4px",
            fontSize: "0.85rem",
            boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            cursor: "help",
          }}
        >
          {label}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default EntityLegend;

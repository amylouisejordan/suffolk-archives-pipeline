import React from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

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

const LegendContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem 1rem;
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  border-radius: 6px;
  font-family: Georgia, serif;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Badge = styled(motion.span)`
  background-color: ${({ $bg }) => $bg};
  color: #fdf6e3;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: Georgia, serif;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
  cursor: help;
  white-space: nowrap;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
`;

const EntityLegend = ({ show }) => {
  if (!show) return null;

  return (
    <LegendContainer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
      role="region"
      aria-label="Entity legend"
    >
      {Object.entries(labelColors).map(([label, color], i) => (
        <Badge
          key={label}
          $bg={color}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, delay: i * 0.05 }}
          title={labelDescriptions[label]}
        >
          {label}
        </Badge>
      ))}
    </LegendContainer>
  );
};

export default EntityLegend;

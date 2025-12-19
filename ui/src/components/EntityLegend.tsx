import { motion } from "framer-motion";
import styled from "styled-components";

export const labelColours = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
  DEFAULT: "#4b3f2f",
} as const;

export const labelDescriptions: Record<keyof typeof labelColours, string> = {
  ORG: "An organization or institution",
  DATE: "A specific date or time reference",
  GPE: "A geopolitical entity (e.g. city, country)",
  PERSON: "A named individual",
  EVENT: "A historical or named event",
  FACILITY: "A named building or site",
  DEFAULT: "Unclassified or fallback entity",
};

const LegendContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 1rem;
  padding: 0.9rem 1.2rem;
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  border-radius: 8px;
  font-family: Georgia, serif;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
`;

interface BadgeProps {
  $bg: string;
}

const Badge = styled(motion.button)<BadgeProps>`
  background-color: ${({ $bg }) => $bg};
  color: #fdf6e3;
  padding: 0.35rem 0.7rem;
  border-radius: 4px;
  font-size: 0.85rem;
  font-family: Georgia, serif;
  border: none;
  cursor: help;
  white-space: nowrap;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover,
  &:focus-visible {
    transform: scale(1.07);
    box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25);
    outline: 2px solid #c2b280;
  }
`;

interface EntityLegendProps {
  show: boolean;
}

const EntityLegend = ({ show }: EntityLegendProps) => {
  if (!show) return null;

  // Optional: hide DEFAULT from the visual legend
  const visibleLabels = Object.entries(labelColours).filter(
    ([label]) => label !== "DEFAULT"
  );

  return (
    <LegendContainer
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      role="region"
      aria-label="Entity legend"
    >
      {visibleLabels.map(([label, colour], i) => (
        <Badge
          key={label}
          $bg={colour}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25, delay: i * 0.05 }}
          title={labelDescriptions[label as keyof typeof labelDescriptions]}
          aria-label={`${label}: ${
            labelDescriptions[label as keyof typeof labelDescriptions]
          }`}
        >
          {label}
        </Badge>
      ))}
    </LegendContainer>
  );
};

export default EntityLegend;

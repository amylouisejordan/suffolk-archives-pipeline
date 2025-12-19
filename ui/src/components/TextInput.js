import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import EntityLegend from "./EntityLegend";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenNib,
  faEye,
  faFeatherAlt,
  faFolderOpen,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { labelColors } from "./FacilityPopup";

const labelDescriptions = {
  MAP: "The name of the map",
  ORG: "An organisation or institution",
  DATE: "A specific date or time reference",
  GPE: "A geographical entity (e.g. city, country)",
  PERSON: "A named individual",
  EVENT: "A historical or named event",
  FACILITY: "A named building or site",
};

const EntitySpan = styled(motion.span)`
  background-color: ${(p) => p.$color};
  color: #fdf6e3;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  white-space: nowrap;
  margin: 0 0.15rem;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.2);
  position: relative;
  cursor: help;

  &::after {
    content: "";
    position: absolute;
    left: 0;
    bottom: -2px;
    height: 2px;
    width: 100%;
    background: #fdf6e3;
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.35s ease;
  }

  &:hover::after {
    transform: scaleX(1);
  }
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
  font-family: Georgia, serif;
  color: #5c4b3b;
  font-size: 1.1rem;
`;

const ToggleButton = styled.button`
  margin-bottom: 1rem;
  background-color: #c2b280;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-family: Georgia, serif;
  color: #3e3e3e;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #b8a06d;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  font-size: 1rem;
  font-family: Georgia, serif;
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  border-radius: 6px;
  color: #3e3e3e;
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.05);
`;

const AnnotatedBox = styled.div`
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  border-radius: 6px;
  padding: 1rem;
  font-family: Georgia, serif;
  color: #3e3e3e;
  line-height: 1.6;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
`;

const LegendToggle = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  font-weight: bold;
  cursor: pointer;
  font-family: Georgia, serif;
  color: #5c4b3b;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.4rem;
  margin: 0 auto 0.5rem;
  font-size: 1rem;
`;

const ErrorMessage = styled.p`
  color: #a94442;
  background-color: #f2dede;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-family: Georgia, serif;
  font-size: 0.95rem;
  border: 1px solid #ebccd1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const escapeRegExp = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const annotateText = (text, entities) => {
  let nodes = [text];

  entities.forEach(({ text: entText, label }) => {
    const color = labelColors[label] || labelColors.DEFAULT;
    const tooltip = labelDescriptions[label] || label;
    const regex = new RegExp(`\\b${escapeRegExp(entText)}\\b`, "gi");

    nodes = nodes.flatMap((node) => {
      if (typeof node !== "string") return node;

      const parts = node.split(regex);

      return parts.flatMap((part, index) =>
        index === parts.length - 1
          ? part
          : [
              part,
              <EntitySpan
                key={`${entText}-${index}-${label}`}
                title={tooltip}
                $color={color}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {entText}
              </EntitySpan>,
            ]
      );
    });
  });

  return nodes;
};

const TextInput = ({ text, setText, handleSubmit, error, entities = [] }) => {
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [showLegend, setShowLegend] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.key === "Enter") {
        handleSubmit();
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
        setShowAnnotated((prev) => !prev);
      }

      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "l") {
        setShowLegend((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleSubmit]);

  const annotatedNodes = useMemo(
    () => annotateText(text, entities),
    [text, entities]
  );

  return (
    <>
      <Label htmlFor="text-input">
        <FontAwesomeIcon icon={faPenNib} />
        Transcribe an excerpt from the archive:
      </Label>

      {entities.length > 0 && (
        <ToggleButton
          onClick={() => setShowAnnotated((prev) => !prev)}
          aria-expanded={showAnnotated}
        >
          <FontAwesomeIcon icon={faEye} />
          {showAnnotated
            ? "Return to Original Transcript"
            : "Reveal Marked Entities"}
        </ToggleButton>
      )}

      <div style={{ marginBottom: "1rem" }}>
        {showAnnotated && entities.length > 0 ? (
          <AnnotatedBox role="region" aria-label="Annotated passage">
            {annotatedNodes}
          </AnnotatedBox>
        ) : (
          <TextArea
            id="text-input"
            ref={inputRef}
            rows={6}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="e.g. Washington Colliery was active in 1845..."
            aria-label="Text input for historical passage"
          />
        )}
      </div>

      <motion.button
        onClick={handleSubmit}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        style={{
          backgroundColor: "#6b4226",
          color: "#fdf6e3",
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          fontFamily: "Georgia, serif",
          marginBottom: "1rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
        aria-label="Submit passage for annotation"
      >
        <FontAwesomeIcon icon={faFeatherAlt} />
        Annotate Historical Entities
      </motion.button>

      {entities.length > 0 && (
        <>
          <LegendToggle
            onClick={() => setShowLegend((prev) => !prev)}
            aria-expanded={showLegend}
          >
            <FontAwesomeIcon icon={faFolderOpen} />
            Entity Classification Key
            <motion.span
              style={{ display: "inline-block" }}
              animate={{ rotate: showLegend ? 90 : 0 }}
              transition={{ duration: 0.3 }}
            >
              ➤
            </motion.span>
          </LegendToggle>

          <EntityLegend show={showLegend} />
        </>
      )}

      {error && (
        <ErrorMessage role="alert" aria-live="assertive">
          <FontAwesomeIcon icon={faExclamationTriangle} />
          {error}
        </ErrorMessage>
      )}
    </>
  );
};

export default TextInput;

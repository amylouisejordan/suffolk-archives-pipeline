import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";
import EntityLegend from "./EntityLegend";

const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
  DEFAULT: "#4b3f2f",
};

const labelDescriptions = {
  MAP: "The name of the map",
  ORG: "An organisation or institution",
  DATE: "A specific date or time reference",
  GPE: "A geographical entity (e.g. city, country)",
  PERSON: "A named individual",
  EVENT: "A historical or named event",
  FACILITY: "A named building or site",
};

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
`;

const AnnotatedBox = styled.div`
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  border-radius: 6px;
  padding: 1rem;
  font-family: Georgia, serif;
  color: #3e3e3e;
  line-height: 1.6;
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
`;

const TextInput = ({ text, setText, handleSubmit, error, entities = [] }) => {
  const [showAnnotated, setShowAnnotated] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  useEffect(() => {
    const input = document.getElementById("text-input");
    if (input) input.focus();
  }, []);

  const getAnnotatedText = () => {
    let annotated = text;
    entities.forEach(({ text: entText, label }) => {
      const color = labelColors[label] || labelColors.DEFAULT;
      const tooltip = `${labelDescriptions[label] || label}`;
      const span = `<span title="${tooltip}" style="
        background-color:${color};
        color:#fdf6e3;
        padding:0.2rem 0.5rem;
        border-radius:4px;
        font-family:Georgia,serif;
        font-size:0.95rem;
        margin:0 0.15rem;
        white-space:nowrap;
        box-shadow:0 1px 2px rgba(0,0,0,0.1);
        cursor:help;
      ">${entText}</span>`;
      annotated = annotated.replace(entText, span);
    });
    return annotated;
  };

  return (
    <>
      <Label htmlFor="text-input">
        ✍️ Enter a passage from the historical record:
      </Label>

      {entities.length > 0 && (
        <ToggleButton
          onClick={() => setShowAnnotated((prev) => !prev)}
          aria-label="Toggle annotated view"
        >
          {showAnnotated ? "🔍 Show Raw Text" : "✨ Show Annotated Entities"}
        </ToggleButton>
      )}

      <div style={{ marginBottom: "1rem" }}>
        {showAnnotated && entities.length > 0 ? (
          <AnnotatedBox
            dangerouslySetInnerHTML={{ __html: getAnnotatedText() }}
            role="region"
            aria-label="Annotated passage"
          />
        ) : (
          <TextArea
            id="text-input"
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
        🪶 Annotate Historical Entities
      </motion.button>

      {entities.length > 0 && (
        <>
          <LegendToggle
            onClick={() => setShowLegend((prev) => !prev)}
            aria-label="Toggle entity key"
          >
            🗂️ Key: Entity Types
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

      {error && <ErrorMessage>⚠️ {error}</ErrorMessage>}
    </>
  );
};

export default TextInput;

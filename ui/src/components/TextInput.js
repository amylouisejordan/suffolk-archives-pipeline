import React, { useState } from "react";

const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
  DEFAULT: "#4b3f2f",
};

const TextInput = ({ text, setText, handleSubmit, error, entities }) => {
  const [showAnnotated, setShowAnnotated] = useState(false);

  const getAnnotatedText = () => {
    let annotated = text;
    entities.forEach(({ text: entText, label, score }) => {
      const color = labelColors[label] || labelColors.DEFAULT;
      const tooltip = `${label}`;
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
      <label
        htmlFor="text-input"
        style={{
          fontWeight: "bold",
          marginBottom: "0.5rem",
          display: "block",
          fontFamily: "Georgia, serif",
          color: "#5c4b3b",
          fontSize: "1.1rem",
        }}
      >
        ✍️ Enter a passage from the historical record:
      </label>

      {entities.length > 0 && (
        <button
          onClick={() => setShowAnnotated((prev) => !prev)}
          style={{
            marginBottom: "1rem",
            backgroundColor: "#c2b280",
            border: "none",
            padding: "0.4rem 0.8rem",
            borderRadius: "4px",
            fontWeight: "bold",
            cursor: "pointer",
            fontFamily: "Georgia, serif",
            color: "#3e3e3e",
          }}
        >
          {showAnnotated ? "🔍 Show Raw Text" : "✨ Show Annotated Entities"}
        </button>
      )}

      {showAnnotated && entities.length > 0 ? (
        <div
          dangerouslySetInnerHTML={{ __html: getAnnotatedText() }}
          style={{
            backgroundColor: "#fffaf0",
            border: "1px solid #c2b280",
            borderRadius: "6px",
            padding: "1rem",
            marginBottom: "1rem",
            fontFamily: "Georgia, serif",
            color: "#3e3e3e",
            lineHeight: "1.6",
          }}
        />
      ) : (
        <textarea
          id="text-input"
          rows={6}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="e.g. Washington Colliery was active in 1845..."
          style={{
            width: "100%",
            padding: "1rem",
            fontSize: "1rem",
            fontFamily: "Georgia, serif",
            backgroundColor: "#fffaf0",
            border: "1px solid #c2b280",
            borderRadius: "6px",
            marginBottom: "1rem",
            color: "#3e3e3e",
          }}
        />
      )}

      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#6b4226",
          color: "#fdf6e3",
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          fontFamily: "Georgia, serif",
          marginBottom: "2rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        🪶 Annotate Historical Entities
      </button>

      {error && (
        <p
          style={{
            color: "#a94442",
            backgroundColor: "#f2dede",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            fontFamily: "Georgia, serif",
            fontSize: "0.95rem",
            border: "1px solid #ebccd1",
          }}
        >
          ⚠️ {error}
        </p>
      )}
    </>
  );
};

export default TextInput;

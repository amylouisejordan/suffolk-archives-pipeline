import React from "react";

const TextInput = ({ text, setText, handleSubmit, error }) => {
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

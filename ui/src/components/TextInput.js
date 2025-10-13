import React from "react";

const TextInput = ({ text, setText, handleSubmit, error }) => {
  return (
    <>
      <label htmlFor="text-input" style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}>
        Paste historical text:
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
          borderRadius: "6px",
          border: "1px solid #ccc",
          marginBottom: "1rem",
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          backgroundColor: "#2563eb",
          color: "white",
          padding: "0.6rem 1.2rem",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "1rem",
          marginBottom: "2rem",
        }}
      >
        🔍 Annotate
      </button>
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
    </>
  );
}

export default TextInput;

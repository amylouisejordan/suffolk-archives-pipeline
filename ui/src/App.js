import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import TextInput from "./components/TextInput";
import FacilityMap from "./components/FacilityMap";

const App = () => {
  const [text, setText] = useState("");
  const [entities, setEntities] = useState([]);
  const [facilityPins, setFacilityPins] = useState([]);
  const [error, setError] = useState(null);
  const [pinnedFacilities, setPinnedFacilities] = useState([]);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Attempts to geocode a facility name using (broad) queries
  const geocodeEntity = async (name) => {
    const queries = [`${name} Suffolk UK`, `${name} Suffolk`, `${name}`];

    for (const q of queries) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            q
          )}`
        );
        const data = await res.json();
        if (data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lng: parseFloat(data[0].lon),
          };
        }
      } catch (err) {
        console.error(`Geocoding failed for query "${q}":`, err);
      }
    }

    console.warn(`No geocoding result for "${name}"`);
    return null;
  };

  // Handles submission of user text for annotation
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:5050/annotate", { text });
      setEntities(res.data);
      setError(null);
      setHasSubmitted(true);

      // Filter for entities labeled as FACILITY
      const facilities = res.data.filter((e) => e.label === "FACILITY");

      // Geocode each facility and attach coordinates
      const geocoded = await Promise.all(
        facilities.map(async (f) => {
          const coords = await geocodeEntity(f.text);
          return coords ? { ...f, ...coords } : null;
        })
      );

      // Only keep successfully geocoded facilities
      setFacilityPins(geocoded.filter(Boolean));
    } catch (err) {
      console.error("Annotation failed:", err);
      setError(
        "Annotation unsuccessful. Please ensure the archival engine is active."
      );
      setHasSubmitted(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Pins a facility if not already pinned
  const handlePin = (facility) => {
    setPinnedFacilities((prev) => {
      const alreadyPinned = prev.some((f) => f.text === facility.text);
      return alreadyPinned ? prev : [...prev, { ...facility, visible: true }];
    });
  };

  return (
    <main
      className="App"
      style={{
        padding: "2rem",
        maxWidth: "900px",
        margin: "auto",
        fontFamily: "Georgia, serif",
        backgroundColor: "#fffaf0",
        color: "#3e3e3e",
      }}
    >
      <h1
        style={{
          fontSize: "2rem",
          marginBottom: "1rem",
          color: "#5c4b3b",
          borderBottom: "2px solid #c2b280",
          paddingBottom: "0.5rem",
        }}
      >
        📜 Suffolk Archival Entity Explorer
      </h1>

      <TextInput
        text={text}
        setText={setText}
        handleSubmit={handleSubmit}
        error={error}
      />

      {isLoading && (
        <div
          style={{
            margin: "1rem 0",
            padding: "1rem",
            backgroundColor: "#fff0e6",
            border: "1px dashed #c2b280",
            borderRadius: "6px",
            fontFamily: "Georgia, serif",
            color: "#5c4b3b",
            textAlign: "center",
          }}
        >
          ⏳ Annotating passage and locating facilities…
        </div>
      )}

      <FacilityMap
        facilityPins={facilityPins}
        entities={entities}
        handlePin={handlePin}
        pinnedFacilities={pinnedFacilities.filter((f) => f.visible)}
        hasSubmitted={hasSubmitted}
      />

      {entities.length > 0 && (
        <button
          onClick={() => {
            const csv = entities
              .map((e) => `"${e.text}","${e.label}"`)
              .join("\n");
            const blob = new Blob([`Text,Label\n${csv}`], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = "annotated_entities.csv";
            a.click();
            URL.revokeObjectURL(url);
          }}
          style={{
            backgroundColor: "#6b4226",
            color: "#fdf6e3",
            padding: "0.5rem 1rem",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "1rem",
            fontFamily: "Georgia, serif",
            marginBottom: "2rem",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          📥 Export Entities as CSV
        </button>
      )}

      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {pinnedFacilities.map((f, i) => (
          <li
            key={i}
            style={{
              marginBottom: "0.5rem",
              backgroundColor: "#fffaf0",
              border: "1px solid #c2b280",
              padding: "0.75rem",
              borderRadius: "6px",
              fontFamily: "Georgia, serif",
              color: "#3e3e3e",
            }}
          >
            <strong>{f.text}</strong> - {f.label}
            <div style={{ marginTop: "0.5rem" }}>
              <label style={{ marginRight: "1rem" }}>
                <input
                  type="checkbox"
                  checked={f.visible}
                  onChange={() =>
                    setPinnedFacilities((prev) =>
                      prev.map((p) =>
                        p.text === f.text ? { ...p, visible: !p.visible } : p
                      )
                    )
                  }
                />
                Show on map
              </label>
              <button
                onClick={() =>
                  setPinnedFacilities((prev) =>
                    prev.filter((p) => p.text !== f.text)
                  )
                }
                style={{
                  backgroundColor: "#c2b280",
                  border: "none",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  fontFamily: "Georgia, serif",
                  color: "#3e3e3e",
                }}
              >
                ❌ Unpin
              </button>
            </div>
          </li>
        ))}
      </ul>

      <footer
        style={{
          marginTop: "2rem",
          paddingTop: "1rem",
          borderTop: "1px solid #c2b280",
          fontStyle: "italic",
          fontFamily: "Georgia, serif",
          color: "#5c4b3b",
        }}
      >
        “History is who we are and why we are the way we are.” - David
        McCullough
        <br />
        <span style={{ fontSize: "0.9rem" }}>
          Source: Suffolk Archives, Historical Records Collection
        </span>
      </footer>
    </main>
  );
};

export default App;

import React, { useState } from "react";
import axios from "axios";
import "./App.css";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

const labelColors = {
  ORG: "#d97706",
  DATE: "#2563eb",
  GPE: "#059669",
  PERSON: "#db2777",
  EVENT: "#7c3aed",
  FACILITY: "#f43f5e",
  DEFAULT: "#6b7280",
};

const facilityIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function App() {
  const [text, setText] = useState("");
  const [entities, setEntities] = useState([]);
  const [facilityPins, setFacilityPins] = useState([]);
  const [error, setError] = useState(null);

  const geocodeEntity = async (name) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          name + " Suffolk UK"
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
      console.error("Geocoding failed:", err);
    }
    return null;
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5050/annotate", { text });
      setEntities(res.data);
      setError(null);

      const facilities = res.data.filter((e) => e.label === "FACILITY");
      const geocoded = await Promise.all(
        facilities.map(async (f) => {
          const coords = await geocodeEntity(f.text);
          return coords ? { ...f, ...coords } : null;
        })
      );
      setFacilityPins(geocoded.filter(Boolean));
    } catch (err) {
      console.error("Annotation failed:", err);
      setError("Failed to annotate. Is the backend running?");
    }
  };

  return (
    <main
      className="App"
      style={{
        padding: "2rem",
        fontFamily: "system-ui, sans-serif",
        maxWidth: "900px",
        margin: "auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>
        🗂 Suffolk Archives NER Explorer
      </h1>

      <label
        htmlFor="text-input"
        style={{ fontWeight: "bold", marginBottom: "0.5rem", display: "block" }}
      >
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

      {facilityPins.length > 0 && (
        <>
          <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
            📍 Facilities on Map
          </h2>
          <MapContainer
            center={[52.245, 0.71]}
            zoom={9}
            style={{
              height: "600px",
              marginBottom: "2rem",
              borderRadius: "8px",
            }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {facilityPins.map((e, i) => (
              <Marker key={i} position={[e.lat, e.lng]} icon={facilityIcon}>
                <Popup>
                  <div style={{ minWidth: "250px", maxWidth: "400px" }}>
                    <strong>{e.text}</strong>
                    <details style={{ marginTop: "0.5rem" }}>
                      <summary
                        style={{ cursor: "pointer", fontWeight: "bold" }}
                      >
                        View all entities
                      </summary>
                      <ul
                        style={{
                          listStyle: "none",
                          paddingLeft: 0,
                          marginTop: "0.5rem",
                        }}
                      >
                        {entities.map((ent, j) => {
                          const color =
                            labelColors[ent.label] || labelColors.DEFAULT;
                          return (
                            <li key={j} style={{ marginBottom: "0.3rem" }}>
                              <span
                                style={{
                                  backgroundColor: color,
                                  color: "white",
                                  padding: "0.2rem 0.5rem",
                                  borderRadius: "4px",
                                  fontSize: "0.8rem",
                                  marginRight: "0.4rem",
                                  display: "inline-block",
                                  minWidth: "50px",
                                  textAlign: "center",
                                }}
                              >
                                {ent.label}
                              </span>
                              <span style={{ fontSize: "0.9rem" }}>
                                {ent.text}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </details>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </>
      )}
    </main>
  );
}

export default App;

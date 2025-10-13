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
    <main className="App" style={{ padding: "2rem", maxWidth: "900px", margin: "auto" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>🗂 Suffolk Archives NER Explorer</h1>
      <TextInput text={text} setText={setText} handleSubmit={handleSubmit} error={error} />
      <FacilityMap facilityPins={facilityPins} entities={entities} />
    </main>
  );
}

export default App;

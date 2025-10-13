import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import FacilityPopup from "./FacilityPopup";

const facilityIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/assets/seal.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
});

const FacilityMap = ({ facilityPins, entities }) => {
  if (facilityPins.length === 0) return null;

  return (
    <>
      <h2
        style={{
          fontSize: "1.5rem",
          marginBottom: "1rem",
          fontFamily: "Georgia, serif",
          color: "#5c4b3b",
        }}
      >
        🗺️ Geographical Registry of Notable Facilities
      </h2>
      <MapContainer
        center={[52.245, 0.71]}
        zoom={9}
        style={{
          height: "600px",
          marginBottom: "2rem",
          borderRadius: "8px",
          border: "1px solid #c2b280",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <TileLayer
          attribution="Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap."
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {facilityPins.map((e, i) => (
          <Marker key={i} position={[e.lat, e.lng]} icon={facilityIcon}>
            <Popup>
              <FacilityPopup facility={e} entities={entities} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};

export default FacilityMap;

import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import FacilityPopup from "./FacilityPopup";

const facilityIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const FacilityMap = ({ facilityPins, entities }) => {
  if (facilityPins.length === 0) return null;

  return (
    <>
      <h2 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>📍 Facilities on Map</h2>
      <MapContainer
        center={[52.245, 0.71]}
        zoom={9}
        style={{ height: "600px", marginBottom: "2rem", borderRadius: "8px" }}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
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
}

export default FacilityMap;

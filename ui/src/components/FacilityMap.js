import React, { useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  ZoomControl,
  ScaleControl,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import FacilityPopup from "./FacilityPopup";

const facilityIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/assets/seal.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
});

// make sure map zoom bounds to all pins
const FitBoundsHandler = ({ pins }) => {
  const map = useMap();

  useEffect(() => {
    if (pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds);
    }
  }, [pins, map]);

  return null;
};

const FacilityMap = ({
  facilityPins,
  entities,
  handlePin,
  pinnedFacilities,
  hasSubmitted,
}) => {
  const allPins = useMemo(
    () => [...facilityPins, ...pinnedFacilities],
    [facilityPins, pinnedFacilities]
  );

  if (hasSubmitted && allPins.length === 0) {
    return (
      <div
        style={{
          backgroundColor: "#fff0e6",
          border: "2px dashed #c2b280",
          padding: "1.5rem",
          borderRadius: "8px",
          marginTop: "2rem",
          textAlign: "center",
          fontFamily: "Georgia, serif",
          color: "#5c4b3b",
          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>
          ⚠️ No Facilities Found
        </h3>
        <p style={{ fontSize: "1rem", margin: 0 }}>
          We couldn’t geocode any facilities from this passage. Try a different
          excerpt, check spelling, or use more specific place names.
        </p>
      </div>
    );
  }

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
        zoomControl={false}
      >
        <TileLayer
          attribution="Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap."
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsHandler pins={allPins} />
        {allPins.map((e) => (
          <Marker
            key={e.id || `${e.lat}-${e.lng}`}
            position={[e.lat, e.lng]}
            icon={facilityIcon}
          >
            <Popup>
              <FacilityPopup
                facility={e}
                entities={entities}
                handlePin={handlePin}
              />
            </Popup>
          </Marker>
        ))}
        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" />
      </MapContainer>
    </>
  );
};

export default FacilityMap;

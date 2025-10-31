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
import styled from "styled-components";
import FacilityPopup from "./FacilityPopup";

const facilityIcon = new L.Icon({
  iconUrl: process.env.PUBLIC_URL + "/assets/seal.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
});

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

const MapHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: Georgia, serif;
  color: #5c4b3b;
`;

const MapWrapper = styled(MapContainer)`
  height: 600px;
  margin-bottom: 2rem;
  border-radius: 8px;
  border: 1px solid #c2b280;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const NoFacilitiesBox = styled.div`
  background-color: #fff0e6;
  border: 2px dashed #c2b280;
  padding: 1.5rem;
  border-radius: 8px;
  margin-top: 2rem;
  text-align: center;
  font-family: Georgia, serif;
  color: #5c4b3b;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
`;

const NoFacilitiesTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
`;

const NoFacilitiesText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const FacilityMap = ({
  facilityPins,
  entities,
  handlePin,
  pinnedFacilities,
  hasSubmitted,
  isLoading,
}) => {
  const allPins = useMemo(
    () => [...facilityPins, ...pinnedFacilities],
    [facilityPins, pinnedFacilities]
  );

  if (hasSubmitted && !isLoading && allPins.length === 0) {
    return (
      <NoFacilitiesBox>
        <NoFacilitiesTitle>⚠️ No Facilities Found</NoFacilitiesTitle>
        <NoFacilitiesText>
          We couldn’t geocode any facilities from this passage. Try a different
          excerpt, check spelling, or use more specific place names.
        </NoFacilitiesText>
      </NoFacilitiesBox>
    );
  }

  return (
    <>
      <MapHeading>🗺️ Geographical Registry of Notable Facilities</MapHeading>
      <MapWrapper center={[52.245, 0.71]} zoom={9} zoomControl={false}>
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
      </MapWrapper>
    </>
  );
};

export default FacilityMap;

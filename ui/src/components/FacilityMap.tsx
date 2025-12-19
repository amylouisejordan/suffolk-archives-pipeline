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
import styled, { keyframes } from "styled-components";
import FacilityPopup from "./FacilityPopup";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkedAlt,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { labelColours } from "./EntityLegend";

const facilityIcon = new L.Icon({
  iconUrl: `${process.env.PUBLIC_URL}/assets/seal.png`,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -36],
});

interface FitBoundsProps {
  pins: { lat: number; lng: number }[];
}

const FitBoundsHandler: React.FC<FitBoundsProps> = ({ pins }) => {
  const map = useMap();

  useEffect(() => {
    if (pins.length > 0) {
      const bounds = L.latLngBounds(pins.map((p) => [p.lat, p.lng]));
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
    }
  }, [pins, map]);

  return null;
};

const MapHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-family: Georgia, serif;
  color: #5c4b3b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const MapWrapper = styled(MapContainer)`
  height: 600px;
  margin-bottom: 2rem;
  border-radius: 8px;
  border: 1px solid #c2b280;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  background-color: #fffaf0;
  overflow: hidden;
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const NoFacilitiesText = styled.p`
  font-size: 1rem;
  margin: 0;
`;

const dropIn = keyframes`
0% { transform: translateY(-20px) scale(0.8); opacity: 0; }
60% { transform: translateY(4px) scale(1.05); opacity: 1; }
100% { transform: translateY(0) scale(1); }
`;

const AnimatedMarkerWrapper = styled.div`
  animation: ${dropIn} 0.6s ease-out;
`;

interface Facility {
  id?: string;
  lat: number;
  lng: number;
  text: string;
  label: keyof typeof labelColours;
  visible?: boolean;
}

interface FacilityMapProps {
  facilityPins: Facility[];
  pinnedFacilities: Facility[];
  entities: any[];
  handlePin: (facility: Facility) => void;
  hasSubmitted: boolean;
  isLoading: boolean;
}

const MAP_THEMES = {
  parchment:
    "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}.png",
  sepia:
    "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png",
  grayscale: "https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png",
  terrain: "https://tile.opentopomap.org/{z}/{x}/{y}.png",
  satellite:
    "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  streets: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  darkmatter:
    "https://cartodb-basemaps-a.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png",
} as const;

type MapTheme = keyof typeof MAP_THEMES;

const FacilityMap = (props: FacilityMapProps) => {
  const {
    facilityPins,
    pinnedFacilities,
    entities,
    handlePin,
    hasSubmitted,
    isLoading,
  } = props;

  const [theme, setTheme] = React.useState<MapTheme>("streets");
  const mapRef = React.useRef<L.Map | null>(null);

  const allPins = useMemo(
    () => [...facilityPins, ...pinnedFacilities],
    [facilityPins, pinnedFacilities]
  );

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const handleKey = (e: KeyboardEvent) => {
      const step = 100;

      switch (e.key) {
        case "ArrowUp":
          map.panBy([0, -step]);
          break;
        case "ArrowDown":
          map.panBy([0, step]);
          break;
        case "ArrowLeft":
          map.panBy([-step, 0]);
          break;
        case "ArrowRight":
          map.panBy([step, 0]);
          break;
        case "+":
          map.zoomIn();
          break;
        case "-":
          map.zoomOut();
          break;
        case "r":
        case "R":
          map.setView([52.245, 0.71], 9);
          break;
        case "f":
        case "F":
          if (allPins.length > 0) {
            const bounds = L.latLngBounds(allPins.map((p) => [p.lat, p.lng]));
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [allPins]);

  if (hasSubmitted && !isLoading && allPins.length === 0) {
    return (
      <NoFacilitiesBox>
        <NoFacilitiesTitle>
          <FontAwesomeIcon icon={faExclamationTriangle} />
          No Facilities Found
        </NoFacilitiesTitle>
        <NoFacilitiesText>
          No geocoded facilities were identified in this excerpt. Consider
          refining the passage, verifying spellings, or specifying named
          locations for improved results.
        </NoFacilitiesText>
      </NoFacilitiesBox>
    );
  }

  return (
    <>
      <MapHeading>
        <FontAwesomeIcon icon={faMapMarkedAlt} />
        Geographical Registry of Notable Facilities
      </MapHeading>

      <div style={{ marginBottom: "1rem", fontFamily: "Georgia, serif" }}>
        <label style={{ marginRight: "0.5rem" }}>Map Theme:</label>
        <select
          value={theme}
          onChange={(e) => setTheme(e.target.value as MapTheme)}
          style={{
            padding: "0.3rem 0.6rem",
            borderRadius: "4px",
            border: "1px solid #c2b280",
            background: "#fffaf0",
            fontFamily: "Georgia, serif",
          }}
        >
          <option value="parchment">Parchment Atlas (Soft & Neutral)</option>
          <option value="sepia">Sepia Archive (Vintage Tone)</option>
          <option value="grayscale">Monochrome Survey (High Contrast)</option>
          <option value="terrain">
            Topographic Relief (Contours & Elevation)
          </option>
          <option value="satellite">Satellite Imagery (Aerial View)</option>
          <option value="streets">Street Map (Modern Cartography)</option>
          <option value="darkmatter">Night Explorer (Dark Mode)</option>
        </select>
      </div>

      <MapWrapper
        ref={mapRef as any}
        center={[52.245, 0.71]}
        zoom={9}
        zoomControl={false}
      >
        <TileLayer
          attribution="Map tiles by Stamen/Stadia Maps. Data by OpenStreetMap."
          url={MAP_THEMES[theme]}
        />

        <FitBoundsHandler pins={allPins} />

        {allPins.map((facility) => (
          <Marker
            key={facility.id ?? `${facility.lat}-${facility.lng}`}
            position={[facility.lat, facility.lng]}
            icon={facilityIcon}
          >
            <AnimatedMarkerWrapper>
              <Popup>
                <FacilityPopup
                  facility={facility}
                  entities={entities}
                  handlePin={handlePin}
                />
              </Popup>
            </AnimatedMarkerWrapper>
          </Marker>
        ))}

        <ZoomControl position="topright" />
        <ScaleControl position="bottomleft" />
      </MapWrapper>
    </>
  );
};

export default FacilityMap;

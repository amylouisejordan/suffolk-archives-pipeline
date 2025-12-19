import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLandmark, faThumbtack } from "@fortawesome/free-solid-svg-icons";
import { labelColours } from "./EntityLegend";

export const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
  DEFAULT: "#4b3f2f",
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
`;

const expand = keyframes`
  from { max-height: 0; opacity: 0; }
  to { max-height: 500px; opacity: 1; }
`;

const PopupContainer = styled.div`
  min-width: 250px;
  max-width: 400px;
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  padding: 1rem;
  border-radius: 6px;
  font-family: Georgia, serif;
  color: #3e3e3e;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  animation: ${fadeIn} 0.3s ease-out;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.15rem;
  color: #5c4b3b;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

const PinButton = styled.button`
  margin-top: 0.6rem;
  background-color: #c2b280;
  border: none;
  padding: 0.45rem 0.9rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-family: Georgia, serif;
  color: #3e3e3e;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  transition: background-color 0.25s ease, transform 0.15s ease;

  &:hover {
    background-color: #b8a06d;
    transform: translateY(-2px);
  }
`;

const Details = styled.details`
  margin-top: 0.9rem;
`;

const Summary = styled.summary`
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
  color: #6b4226;
  font-family: Georgia, serif;
  outline: none;

  &:focus {
    outline: 2px solid #c2b280;
    border-radius: 4px;
  }
`;

const EntityList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0.6rem;
  animation: ${expand} 0.35s ease-out;
  overflow: hidden;
`;

const EntityItem = styled.li`
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
`;

interface EntityLabelProps {
  $bg: string;
}

const EntityDot = styled.span<EntityLabelProps>`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 50%;
  background-color: ${({ $bg }) => $bg};
  display: inline-block;
`;

const EntityLabel = styled.span<EntityLabelProps>`
  background-color: ${({ $bg }) => $bg};
  color: #fdf6e3;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: Georgia, serif;
  min-width: 60px;
  text-align: center;
  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.1);
`;

const EntityText = styled.span`
  font-size: 0.9rem;
  font-family: Georgia, serif;
`;

export interface Entity {
  text: string;
  label: keyof typeof labelColours;
  id?: string;
  lat: number;
  lng: number;
  visible?: boolean;
}

interface FacilityPopupProps {
  facility: Entity;
  entities: Entity[];
  handlePin: (facility: Entity) => void;
}

const FacilityPopup = (props: FacilityPopupProps) => {
  const { facility, entities, handlePin } = props;

  return (
    <PopupContainer
      role="dialog"
      aria-label={`Facility details: ${facility.text}`}
    >
      <Title>
        <FontAwesomeIcon icon={faLandmark} />
        <em>{facility.text}</em>
      </Title>

      <PinButton
        onClick={() => handlePin(facility)}
        aria-label={`Pin facility: ${facility.text}`}
      >
        <FontAwesomeIcon icon={faThumbtack} />
        Pin this Facility
      </PinButton>

      <Details>
        <Summary aria-controls="entity-list">
          Reveal associated entities
        </Summary>
        <EntityList id="entity-list">
          {entities.map((ent, j) => {
            const bg = labelColours[ent.label] || labelColours.DEFAULT;
            return (
              <EntityItem key={`${ent.label}-${ent.text}-${j}`}>
                <EntityDot $bg={bg} aria-hidden="true" />
                <EntityLabel $bg={bg}>{ent.label}</EntityLabel>
                <EntityText>{ent.text}</EntityText>
              </EntityItem>
            );
          })}
        </EntityList>
      </Details>
    </PopupContainer>
  );
};

export default FacilityPopup;

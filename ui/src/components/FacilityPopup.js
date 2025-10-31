import React from "react";
import styled from "styled-components";

const labelColors = {
  ORG: "#a67c52",
  DATE: "#6b4226",
  GPE: "#7f674c",
  PERSON: "#8b5e3c",
  EVENT: "#5c4b3b",
  FACILITY: "#9c6644",
  DEFAULT: "#4b3f2f",
};

const PopupContainer = styled.div`
  min-width: 250px;
  max-width: 400px;
  background-color: #fffaf0;
  border: 1px solid #c2b280;
  padding: 1rem;
  border-radius: 6px;
  font-family: Georgia, serif;
  color: #3e3e3e;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.1rem;
  color: #5c4b3b;
`;

const PinButton = styled.button`
  margin-top: 0.5rem;
  background-color: #c2b280;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-family: Georgia, serif;
  color: #3e3e3e;
`;

const Details = styled.details`
  margin-top: 0.75rem;
`;

const Summary = styled.summary`
  cursor: pointer;
  font-weight: bold;
  font-size: 0.95rem;
  color: #6b4226;
`;

const EntityList = styled.ul`
  list-style: none;
  padding-left: 0;
  margin-top: 0.5rem;
`;

const EntityItem = styled.li`
  margin-bottom: 0.4rem;
`;

const EntityLabel = styled.span`
  background-color: ${({ $bg }) => $bg};
  color: #fdf6e3;
  padding: 0.25rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-family: Georgia, serif;
  margin-right: 0.5rem;
  display: inline-block;
  min-width: 60px;
  text-align: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const EntityText = styled.span`
  font-size: 0.9rem;
`;

const FacilityPopup = ({ facility, entities, handlePin }) => {
  return (
    <PopupContainer>
      <Title>
        🏛️ <em>{facility.text}</em>
      </Title>
      <PinButton
        onClick={() => handlePin(facility)}
        aria-label={`Pin facility ${facility?.text}`}
      >
        📌 Pin this Facility
      </PinButton>
      <Details>
        <Summary>Reveal associated entities</Summary>
        <EntityList>
          {entities.map((ent, j) => {
            const color = labelColors[ent.label] || labelColors.DEFAULT;
            return (
              <EntityItem key={j}>
                <EntityLabel $bg={color}>{ent.label}</EntityLabel>
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

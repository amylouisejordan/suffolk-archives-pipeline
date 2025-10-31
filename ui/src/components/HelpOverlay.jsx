import React from "react";
import styled, { keyframes } from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFeatherAlt,
  faLightbulb,
  faTimes,
  faScroll,
} from "@fortawesome/free-solid-svg-icons";

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(255, 250, 240, 0.97);
  z-index: 1000;
  padding: 2rem;
  font-family: Georgia, serif;
  color: #3e3e3e;
  overflow-y: auto;
  box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.05);
  border-left: 1px solid #c2b280;
  border-right: 1px solid #c2b280;
`;

const Content = styled.div`
  max-width: 720px;
  margin: auto;
  animation: ${fadeIn} 0.4s ease-out;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background-color: #c2b280;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-family: Georgia, serif;
  color: #3e3e3e;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #b8a06d;
  }
`;

const Heading = styled.h2`
  font-size: 1.8rem;
  color: #5c4b3b;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 1px 1px rgba(255, 240, 200, 0.6);
`;

const Section = styled.section`
  margin-bottom: 2.5rem;
  border-top: 1px dashed #c2b280;
  padding-top: 1.5rem;
`;

const Subheading = styled.h3`
  font-size: 1.3rem;
  color: #6b4226;
  margin-bottom: 0.75rem;
`;

const List = styled.ul`
  padding-left: 1.5rem;
  margin: 0;
`;

const Item = styled.li`
  margin-bottom: 0.8rem;
  font-size: 1rem;
  line-height: 1.7;
  list-style-type: disc;
`;

const HelpOverlay = ({ onClose }) => (
  <Overlay role="dialog" aria-label="Help overlay">
    <CloseButton onClick={onClose} aria-label="Close help overlay">
      <FontAwesomeIcon icon={faTimes} />
    </CloseButton>

    <Content>
      <Heading>
        <FontAwesomeIcon icon={faScroll} style={{ marginRight: "0.5rem" }} />
        Welcome to the Suffolk Archival Entity Explorer
      </Heading>

      <Section>
        <Subheading>
          <FontAwesomeIcon icon={faFeatherAlt} />
          How to Use This Explorer
        </Subheading>
        <List>
          <Item>
            <strong>Transcribe a passage:</strong> Paste or type a historical
            excerpt into the text box.
          </Item>
          <Item>
            <strong>Annotate:</strong>
            <em>Annotate Historical Entities</em> to highlight names, dates,
            places, and facilities.
          </Item>
          <Item>
            <strong>Map:</strong> View geocoded facilities on the interactive
            map. Pin and unpin locations to aid comparison.
          </Item>
          <Item>
            <strong>Export:</strong> Download a CSV of all annotated entities
            from the selected passage for archival or research use.
          </Item>
        </List>
      </Section>

      <Section>
        <Subheading>
          <FontAwesomeIcon icon={faLightbulb} />
          Tips for Better Results
        </Subheading>
        <List>
          <Item>
            Use specific place names (e.g. “Washington Colliery” instead of “the
            mine”) for more accurate geocoding.
          </Item>
          <Item>
            Shorter passages with clear structure tend to produce cleaner
            annotations.
          </Item>
          <Item>
            Toggle between raw and annotated views to compare interpretations.
          </Item>
          <Item>
            Use the entity key to understand each label’s meaning and purpose.
          </Item>
        </List>
      </Section>
    </Content>
  </Overlay>
);

export default HelpOverlay;

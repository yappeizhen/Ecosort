// Import dependencies
import React from "react";
import styled from "styled-components";
const StyledContainer = styled.div`
  display: flex;
  flex-direction: row;
  font-family: "Poppins";
  width: 100%;
  background-color: rgb(240, 248, 255, 0.7);
  bottom: 0;
  margin: 0;
  font-size: 11px;
  padding: 0 8px;
`;
function Footer() {
  return (
    <>
      <StyledContainer>
        Made with ❤️ by Aloysius, Pei Zhen, Saga, Terence, Vinicius
      </StyledContainer>
    </>
  );
}

export default Footer;

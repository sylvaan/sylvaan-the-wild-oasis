import styled from "styled-components";

const StyledLogo = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 2.4rem;
`;

const Img = styled.img`
  height: 9.6rem;
  width: auto;
`;

const Heading = styled.span`
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-grey-100); /* Will check this color against background */
  /* Actually Sidebar is white, so text should be dark. GlobalStyles says default is grey-700. Let's make it brand or dark grey. */
  color: var(--color-brand-500);
  letter-spacing: 0.5px;
`;

function Logo() {
  return (
    <StyledLogo>
      <Img src="/logo-light.png" alt="Logo" />
      <Heading>The Wild Oasis</Heading>
    </StyledLogo>
  );
}

export default Logo;

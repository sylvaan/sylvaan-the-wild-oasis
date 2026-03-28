import styled from "styled-components";
import Logo from "./Logo";
import MainNav from "./MainNav";

const StyledSidebar = styled.aside`
  background-color: var(--color-grey-0);
  padding: 3.2rem 2.4rem;
  border-right: 1px solid var(--color-grey-100);
  grid-row: 1 / -1;
  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const StyledVersion = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-grey-400);
  text-align: center;
  margin-top: auto;
`;

function Sidebar() {
  return (
    <StyledSidebar>
      <Logo />
      <MainNav />

      <StyledVersion>v{__APP_VERSION__}</StyledVersion>
    </StyledSidebar>
  );
}

export default Sidebar;

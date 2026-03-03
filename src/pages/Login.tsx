import styled from "styled-components";
import Logo from "../ui/Logo";
import Heading from "../ui/Heading";
import LoginForm from "../features/authentication/LoginForm";
import DarkModeToggle from "../ui/DarkModeToggle";

const LoginLayout = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 48rem;
  align-content: center;
  justify-content: center;
  gap: 3.2rem;
  background-color: var(--color-grey-50);
`;

const DarkModeWrapper = styled.div`
  position: absolute;
  top: 2.4rem;
  right: 2.4rem;
`;

function Login() {
  return (
    <LoginLayout>
      <DarkModeWrapper>
        <DarkModeToggle />
      </DarkModeWrapper>
      <Logo />
      <Heading as="h4">Log in to your account</Heading>
      <LoginForm />
    </LoginLayout>
  );
}

export default Login;

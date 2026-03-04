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

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useUser } from "../features/authentication/useUser";

function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useUser();

  useEffect(
    function () {
      if (isAuthenticated && !isLoading) navigate("/dashboard");
    },
    [isAuthenticated, isLoading, navigate]
  );

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

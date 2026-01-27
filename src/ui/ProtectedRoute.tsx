import styled from "styled-components";

// For now, this just renders children. We will add authentication logic later.
const FullPage = styled.div`
  height: 100vh;
  background-color: var(--color-grey-50);
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface ProtectedRouteProps {
  children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  // 1. Load the authenticated user
  const isAuthenticated = true; // Temporary mock

  // 2. If there is NO authenticated user, redirect to the /login
  if (!isAuthenticated) {
    // return <Navigate to="/login" />;
    return (
      <FullPage>
        <p>Redirecting...</p>
      </FullPage>
    );
  }

  // 3. If there IS a user, render the app
  if (isAuthenticated) return children;
}

export default ProtectedRoute;

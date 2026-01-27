import styled from "styled-components";

const StyledFormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;

  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
  }

  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }

  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label<{ htmlFor?: string }>`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

import type { ReactElement } from "react";
// ... imports

// ... imports

interface FormRowProps {
  label?: string;
  error?: string;
  children: ReactElement<{ id?: string }>; // Enforce single ReactElement with optional id prop
  id?: string;
}

function FormRow({ label, error, children }: FormRowProps) {
  // We can safely access children.props.id because we typed it as ReactElement
  const childId = children.props.id;
  
  return (
    <StyledFormRow>
      {label && <Label htmlFor={childId}>{label}</Label>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;

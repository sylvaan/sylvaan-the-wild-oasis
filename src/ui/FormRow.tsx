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
`;

const Label = styled.label<{ htmlFor?: string }>`
  font-weight: 500;
`;

const Error = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

import { type ReactNode, isValidElement } from "react";

interface FormRowProps {
  label?: string;
  error?: string;
  children: ReactNode;
}

function FormRow({ label, error, children }: FormRowProps) {
  const childId = isValidElement(children)
    ? (children.props as { id?: string }).id
    : undefined;

  return (
    <StyledFormRow>
      {label ? <Label htmlFor={childId}>{label}</Label> : <span></span>}
      {children}
      {error && <Error>{error}</Error>}
    </StyledFormRow>
  );
}

export default FormRow;

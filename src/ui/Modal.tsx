import { cloneElement, createContext, useContext, useState } from "react";
import type { ReactElement } from "react";
import { createPortal } from "react-dom";
import { HiXMark } from "react-icons/hi2";
import styled from "styled-components";
import { useOutsideClick } from "../hooks/useOutsideClick";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const Button = styled.button`
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transform: translateX(0.8rem);
  transition: all 0.2s;
  position: absolute;
  top: 1.2rem;
  right: 1.9rem;

  &:hover {
    background-color: var(--color-grey-100);
  }

  & svg {
    width: 2.4rem;
    height: 2.4rem;
    color: var(--color-grey-500);
  }
`;

// Define context type
interface ModalContextType {
  openName: string;
  close: () => void;
  open: (name: string) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

function Modal({ children }: { children: React.ReactNode }) {
  const [openName, setOpenName] = useState("");

  const close = () => setOpenName("");
  const open = setOpenName;

  return (
    <ModalContext.Provider value={{ openName, close, open }}>
      {children}
    </ModalContext.Provider>
  );
}

function Open({ children, opens: opensWindowName }: { children: ReactElement; opens: string }) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Open must be used within Modal");
  const { open } = context;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return cloneElement(children, { onClick: () => open(opensWindowName) } as any);
}

function Window({ children, name }: { children: ReactElement; name: string }) {
  const context = useContext(ModalContext);
  if (!context) throw new Error("Window must be used within Modal");
  const { openName, close } = context;
  
  const { ref } = useOutsideClick<HTMLDivElement>(close);

  if (name !== openName) return null;

  return createPortal(
    <Overlay>
      <StyledModal ref={ref}>
        <Button onClick={close}>
          <HiXMark />
        </Button>
        <div>
           {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
           {cloneElement(children, { onCloseModal: close } as any)}
        </div>
      </StyledModal>
    </Overlay>,
    document.body
  );
}

// Assign subcomponents to Modal
// We need to use "as any" or define the type properly if we want to avoid TS errors with compound components assigned this way
// But idiomatic React usually allows this.
const ModalComponent = Modal as typeof Modal & {
  Open: typeof Open;
  Window: typeof Window;
};

ModalComponent.Open = Open;
ModalComponent.Window = Window;

export default ModalComponent;

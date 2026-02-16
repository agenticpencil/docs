"use client";

import { createContext, useContext, useState, useCallback } from "react";
import WaitlistModal from "./WaitlistModal";

type WaitlistContextType = {
  openModal: () => void;
};

const WaitlistContext = createContext<WaitlistContextType>({
  openModal: () => {},
});

export const useWaitlist = () => useContext(WaitlistContext);

export default function WaitlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    // Fire click tracking
    fetch("/api/track-click", { method: "POST" }).catch(() => {});
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, []);

  return (
    <WaitlistContext.Provider value={{ openModal }}>
      {children}
      <WaitlistModal isOpen={isOpen} onClose={closeModal} />
    </WaitlistContext.Provider>
  );
}

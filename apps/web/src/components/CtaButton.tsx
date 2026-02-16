"use client";

import { useWaitlist } from "./WaitlistProvider";

export default function CtaButton({
  children,
  className = "btn-primary",
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const { openModal } = useWaitlist();

  return (
    <button className={className} style={style} onClick={openModal}>
      {children}
    </button>
  );
}

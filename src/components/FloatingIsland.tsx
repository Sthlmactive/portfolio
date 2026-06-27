"use client";

import { useEffect, useState } from "react";
import BookingModal from "@/components/BookingModal";

export default function FloatingIsland() {
  const [open, setOpen] = useState(false);

  // Let other components (e.g. the header's "Contact" link) open the modal.
  useEffect(() => {
    const openModal = () => setOpen(true);
    window.addEventListener("oskar:open-booking", openModal);
    return () => window.removeEventListener("oskar:open-booking", openModal);
  }, []);

  return (
    <>
      <div className="island-wrap">
        <div className="island">
          <span className="island-status">
            <span className="island-dot" aria-hidden="true" />
            <span className="island-status-text">Available · Stockholm</span>
          </span>
          <button
            type="button"
            className="island-btn"
            onClick={() => setOpen(true)}
          >
            Let&apos;s talk
          </button>
        </div>
      </div>

      <BookingModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}

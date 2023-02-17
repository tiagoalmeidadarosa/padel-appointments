"use client";
import { KoHo } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";
import BackgroundImage from "@/components/BackgroundImage";

const koho = KoHo({
  subsets: ["latin"],
  weight: "500",
});

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();

  const handleSelectedCourt = (courtId: number) => {
    setSelectedCourtId(courtId);
    setOpenModal(true);
  };

  return (
    <>
      <style jsx global>{`
        html,
        body,
        span,
        input {
          font-family: ${koho.style.fontFamily} !important;
        }
      `}</style>

      <main className={styles.main}>
        <BackgroundImage onClick={handleSelectedCourt} />

        {openModal && selectedCourtId && (
          <AppointmentModal
            show={openModal}
            courtId={selectedCourtId}
            onCancel={() => {
              setSelectedCourtId(undefined);
              setOpenModal(false);
            }}
          />
        )}
      </main>
    </>
  );
}

"use client";
import { KoHo } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";
import Background from "@/components/Background";
import { ModalSteps } from "@/components/AppointmentModal/shared";

const koho = KoHo({
  subsets: ["latin"],
  weight: "500",
});

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();
  const [selectedStep, setSelectedStep] = useState<ModalSteps>();
  const [selectedHour, setSelectedHour] = useState<string>();

  const handleSelectedCourt = (
    courtId: number,
    step?: ModalSteps,
    hour?: string
  ) => {
    setSelectedCourtId(courtId);
    setSelectedStep(step);
    setSelectedHour(hour);
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
        <Background onClick={handleSelectedCourt} />

        {openModal && selectedCourtId && (
          <AppointmentModal
            show={openModal}
            courtId={selectedCourtId}
            onCancel={() => {
              setSelectedCourtId(undefined);
              setOpenModal(false);
            }}
            step={selectedStep}
            hour={selectedHour}
          />
        )}
      </main>
    </>
  );
}

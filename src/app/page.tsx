"use client";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";
import BackgroundImage from "@/components/BackgroundImage";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();

  const handleSelectedCourt = (courtId: number) => {
    setSelectedCourtId(courtId);
    setOpenModal(true);
  };

  return (
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
  );
}

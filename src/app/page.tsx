"use client";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import AppointmentModal from "@/components/AppointmentModal";

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
      <div className={styles.center} onClick={() => handleSelectedCourt(1)}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js Logo"
          width={180}
          height={37}
          priority
        />
        <div className={styles.thirteen}>
          <Image src="/thirteen.svg" alt="13" width={40} height={31} priority />
        </div>
      </div>

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

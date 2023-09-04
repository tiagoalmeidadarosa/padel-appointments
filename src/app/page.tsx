"use client";
import { Rubik } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import AppointmentModal from "@/components/AppointmentDrawer";
import Background from "@/components/Background";
import { ConfigProvider } from "antd";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();

  const handleSelectedCourt = (
    courtId: number,
  ) => {
    setSelectedCourtId(courtId);
    setOpenModal(true);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: rubik.style.fontFamily,
        },
      }}
    >
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
          />
        )}
      </main>
    </ConfigProvider>
  );
}

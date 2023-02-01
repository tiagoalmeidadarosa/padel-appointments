"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import { Button, Modal, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { addDays, getHours } from "@/utils";

const inter = Inter({ subsets: ["latin"] });

enum ModalSteps {
  step1,
  step2,
}

export default function Home() {
  const { Text } = Typography;
  const [openModal, setOpenModal] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.step1);
  const [date, setDate] = useState<Date>(new Date());

  const showModal = (show: boolean) => {
    setOpenModal(show);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpenModal(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const CustomTitle = (
    <div className={styles.modalTitle}>
      {currentStep === ModalSteps.step1 && (
        <>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setDate((prev) => addDays(prev, -1))}
            disabled={new Date().getDate() === date.getDate()}
          />
          <Text>{date.toDateString()}</Text>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => setDate((prev) => addDays(prev, 1))}
          />
        </>
      )}
    </div>
  );

  const ModalContent = (
    <div className={styles.modalBody}>
      {currentStep === ModalSteps.step1 && (
        <>
          {getHours(date).map((h: number, index: number) => {
            const disabled = h === 20;
            return (
              <div key={`hour_${index}`}>
                <Button disabled={disabled}>{`${h}:00`}</Button>
              </div>
            );
          })}
        </>
      )}
    </div>
  );

  return (
    <main className={styles.main}>
      <div className={styles.center} onClick={() => showModal(true)}>
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

      <Modal
        title={CustomTitle}
        open={openModal}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={() => showModal(false)}
        closable={false}
      >
        {ModalContent}
      </Modal>
    </main>
  );
}

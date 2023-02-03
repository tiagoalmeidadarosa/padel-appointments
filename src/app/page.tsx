"use client";

import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "./page.module.css";
import { useEffect, useState } from "react";
import { Button, Input, Modal, Spin, Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { addDays, getHours } from "@/utils/date";
import { Appointment } from "@/services/appointment/interfaces";
import { AppointmentService } from "@/services/appointment";
import { zeroPad } from "@/utils/number";

const inter = Inter({ subsets: ["latin"] });

enum ModalSteps {
  step1,
  step2,
}

export default function Home() {
  const { Text } = Typography;

  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.step1);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  useEffect(() => {
    if (selectedCourtId && selectedDate) {
      setIsLoading(true);
      AppointmentService.getAppointments(selectedCourtId, selectedDate)
        .then((response: Appointment[]) => {
          setAppointments(response);
        })
        .catch((err) => {
          console.log(err);
          setAppointments([] as Appointment[]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [selectedCourtId, selectedDate]);

  const showModal = (show: boolean) => {
    setOpenModal(show);
  };

  const resetModal = () => {
    setSelectedCourtId(undefined);
    setSelectedDate(new Date());
    setSelectedHour(undefined);
    setSelectedAppointment(undefined);
    setCurrentStep(ModalSteps.step1);
    setOpenModal(false);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    //Todo: call api
    setTimeout(() => {
      setConfirmLoading(false);
      setOpenModal(false);
    }, 2000);
  };

  const CustomTitle = (
    <>
      {currentStep === ModalSteps.step1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setSelectedDate((prev) => addDays(prev, -1))}
            disabled={new Date().getDate() === selectedDate.getDate()}
          />
          <Text>{selectedDate.toDateString()}</Text>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => setSelectedDate((prev) => addDays(prev, 1))}
          />
        </div>
      )}
      {currentStep === ModalSteps.step2 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Text>{`${selectedDate.toDateString()} ${selectedHour}`}</Text>
        </div>
      )}
    </>
  );

  const CustomFooter = (
    <>
      {currentStep === ModalSteps.step1 && (
        <Button key="back" onClick={resetModal}>
          Fechar
        </Button>
      )}
      {currentStep === ModalSteps.step2 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Button danger type="text" disabled={!selectedAppointment}>
            Delete
          </Button>
          <div>
            <Button key="back" onClick={() => setCurrentStep(ModalSteps.step1)}>
              Voltar
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={handleOk}
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </>
  );

  const ModalContent = (
    <div className={styles.modalBody}>
      {isLoading && <Spin />}
      {!isLoading && (
        <>
          {currentStep === ModalSteps.step1 && (
            <>
              {getHours(selectedDate).map((h: number, index: number) => {
                var formattedHour = `${zeroPad(h)}:00:00`;
                var appointment = appointments.find(
                  (a: Appointment) => a.time === formattedHour
                );
                return (
                  <Button
                    key={`hour_${index}`}
                    className={!!appointment ? styles.grayButton : ""}
                    onClick={() => {
                      setSelectedHour(formattedHour);
                      setSelectedAppointment(appointment);
                      setCurrentStep(ModalSteps.step2);
                    }}
                  >
                    {formattedHour.substring(0, 5)}
                  </Button>
                );
              })}
            </>
          )}
          {currentStep === ModalSteps.step2 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
                width: "50%",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Text>{"Nome:"}</Text>
                <Input
                  placeholder="Digite o nome"
                  prefix={<UserOutlined />}
                  value={selectedAppointment?.customerName}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <Text>{"Telefone:"}</Text>
                <Input
                  placeholder="Digite o telefone"
                  prefix={<PhoneOutlined />}
                  value={selectedAppointment?.customerPhoneNumber}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  return (
    <main className={styles.main}>
      <div
        className={styles.center}
        onClick={() => {
          setSelectedCourtId(1);
          showModal(true);
        }}
      >
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
        confirmLoading={confirmLoading}
        closable={false}
        footer={CustomFooter}
      >
        {ModalContent}
      </Modal>
    </main>
  );
}

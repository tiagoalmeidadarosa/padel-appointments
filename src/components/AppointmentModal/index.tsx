import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Input, Modal, Spin, Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { AppointmentService } from "@/services/appointment";
import { Appointment } from "@/services/appointment/interfaces";
import { addDays, getHours } from "@/utils/date";
import { zeroPad } from "@/utils/number";

enum ModalSteps {
  step1,
  step2,
}

type Props = {
  show: boolean;
  courtId: number;
  onCancel: () => void;
};
export default function AppointmentModal(props: Props) {
  const { onCancel, courtId, show } = props;
  const { Text } = Typography;

  const [isLoading, setIsLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.step1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  useEffect(() => {
    if (courtId && selectedDate) {
      setIsLoading(true);
      AppointmentService.getAppointments(courtId, selectedDate)
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
  }, [courtId, selectedDate]);

  const resetModal = () => {
    setSelectedDate(new Date());
    setSelectedHour(undefined);
    setSelectedAppointment(undefined);
    setCurrentStep(ModalSteps.step1);
    onCancel();
  };

  const handleOk = () => {
    setConfirmLoading(true);
    //Todo: call api
    setTimeout(() => {
      setConfirmLoading(false);
      onCancel();
    }, 2000);
  };

  const CustomTitle = (
    <>
      {currentStep === ModalSteps.step1 && (
        <div className={`${styles.space} ${styles.centralizedItems}`}>
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
        <div className={styles.center}>
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
        <div className={styles.space}>
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
    <div className={styles.content}>
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
            <div className={styles.inputs}>
              <div className={styles.input}>
                <Text>{"Nome:"}</Text>
                <Input
                  placeholder="Digite o nome"
                  prefix={<UserOutlined />}
                  value={selectedAppointment?.customerName}
                />
              </div>
              <div className={styles.input}>
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
    <Modal
      open={show}
      title={CustomTitle}
      confirmLoading={confirmLoading}
      closable={false}
      footer={CustomFooter}
    >
      {ModalContent}
    </Modal>
  );
}

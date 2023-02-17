import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Input, Modal, Spin, Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  UserOutlined,
  PhoneOutlined,
  ExclamationCircleFilled,
} from "@ant-design/icons";
import { AppointmentService } from "@/services/appointment";
import { Appointment } from "@/services/appointment/interfaces";
import { addDays, getHours, getUTCString } from "@/utils/date";
import { zeroPad } from "@/utils/number";
import { AxiosResponse } from "axios";

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
  const [selectedCustomerName, setSelectedCustomerName] = useState<string>();
  const [selectedCustomerPhoneNumber, setSelectedCustomerPhoneNumber] =
    useState<string>();

  useEffect(() => {
    if (courtId && selectedDate) {
      setIsLoading(true);
      AppointmentService.getAppointments(
        courtId,
        getUTCString(selectedDate) as string
      )
        .then((response: AxiosResponse<Appointment[]>) => {
          setAppointments(response.data);
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
    if (selectedAppointment) {
      AppointmentService.updateAppointment(courtId, {
        ...selectedAppointment,
        customerName: selectedCustomerName,
        customerPhoneNumber: selectedCustomerPhoneNumber,
      } as Appointment)
        .then((response: AxiosResponse) => {
          if (![200, 201, 204].includes(response.status)) throw Error;
          Modal.info(OkModal);
        })
        .catch((err) => {
          console.log(err);
          Modal.info(ErrorModal);
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    } else {
      AppointmentService.addAppointment(courtId, {
        date: getUTCString(selectedDate) as string,
        time: selectedHour,
        customerName: selectedCustomerName,
        customerPhoneNumber: selectedCustomerPhoneNumber,
      } as Appointment)
        .then((response: AxiosResponse) => {
          if (![200, 201, 204].includes(response.status)) throw Error;
          Modal.info(OkModal);
        })
        .catch((err) => {
          console.log(err);
          Modal.info(ErrorModal);
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };

  const handleDelete = () => {
    if (selectedAppointment) {
      AppointmentService.deleteAppointment(courtId, selectedAppointment.id)
        .then((response: AxiosResponse) => {
          if (![200, 201, 204].includes(response.status)) throw Error;
          Modal.info(OkModal);
        })
        .catch((err) => {
          console.log(err);
          Modal.info(ErrorModal);
        });
    }
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
          <Text>{`Quadra ${courtId} - ${selectedDate.toDateString()}`}</Text>
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
          <Button
            danger
            type="text"
            disabled={!selectedAppointment}
            onClick={() => Modal.confirm(ConfirmModal)}
          >
            Cancelar horário
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
              disabled={!selectedCustomerName || !selectedCustomerPhoneNumber}
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
                    type="primary"
                    className={!!appointment ? styles.grayButton : ""}
                    onClick={() => {
                      setSelectedHour(formattedHour);
                      setSelectedAppointment(appointment);
                      setSelectedCustomerName(appointment?.customerName);
                      setSelectedCustomerPhoneNumber(
                        appointment?.customerPhoneNumber
                      );
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
                  value={selectedCustomerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedCustomerName(e.target.value)
                  }
                />
              </div>
              <div className={styles.input}>
                <Text>{"Telefone:"}</Text>
                <Input
                  placeholder="Digite o telefone"
                  prefix={<PhoneOutlined />}
                  value={selectedCustomerPhoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedCustomerPhoneNumber(e.target.value)
                  }
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );

  const OkModal = {
    title: "Alterações salvas!",
    content: <Text>Agendamento adicionado/editado com sucesso.</Text>,
    onOk() {
      onCancel();
    },
  };

  const ErrorModal = {
    title: "Erro!",
    content: <Text>Não foi possível adicionar/editar agendamento.</Text>,
  };

  const ConfirmModal = {
    title: "Você deseja realmente cancelar esse agendamento?",
    icon: <ExclamationCircleFilled />,
    content: (
      <Text>
        Após deletar, não será possível a reversão do horário, apenas o marcando
        novamente.
      </Text>
    ),
    onOk() {
      handleDelete();
    },
  };

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

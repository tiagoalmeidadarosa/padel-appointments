import styles from "./styles.module.css";
import { ModalSteps } from "./shared";
import { Button, Modal, notification, Popconfirm, Typography } from "antd";
import { Appointment } from "@/services/appointment/interfaces";
import { AppointmentService } from "@/services/appointment";
import { getUTCString } from "@/utils/date";
import { useState } from "react";
import React from "react";

type Props = {
  courtId: number;
  currentStep: ModalSteps;
  confirmLoading: boolean;
  selectedAppointment: Appointment | undefined;
  selectedDate: Date;
  selectedHour: string | undefined;
  fromFreeCourts: boolean;
  setCurrentStep: React.Dispatch<React.SetStateAction<ModalSteps>>;
  setConfirmLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetModal: () => void;
};
const CustomFooter = ({
  courtId,
  currentStep,
  confirmLoading,
  selectedAppointment,
  selectedDate,
  selectedHour,
  fromFreeCourts,
  setCurrentStep,
  setConfirmLoading,
  resetModal,
}: Props) => {
  const { Text } = Typography;

  const [api, contextHolder] = notification.useNotification();
  const [openPopconfirm, setOpenPopconfirm] = useState(false);

  type NotificationType = "success" | "info" | "warning" | "error";

  const openNotification = (type: NotificationType) => {
    const placement = "topLeft";
    if (type === "error") {
      api[type]({
        message: "Erro!",
        description: (
          <Text>
            Não foi possível {selectedAppointment?.id ? "editar" : "adicionar"}{" "}
            agendamento.
          </Text>
        ),
        placement,
      });
    } else {
      api[type]({
        message: "Alterações salvas!",
        description: (
          <Text>
            Agendamento {selectedAppointment?.id ? "editado" : "adicionado"} com
            sucesso.
          </Text>
        ),
        placement,
      });
      setTimeout(function () {
        window.location.reload();
      }, 3000);
    }
  };

  const ConfirmModal = {
    title: "Você deseja realmente cancelar esse agendamento?",
    content: (
      <Text>
        Após deletar, não será possível a reversão do horário, apenas o marcando
        novamente.
      </Text>
    ),
    cancelText: "Cancelar",
    onOk() {
      handleDelete(false);
    },
  };

  const ConfirmWithRecurrenceModal = {
    title: "Você deseja realmente cancelar esse agendamento?",
    content: (
      <div className={styles.input}>
        <Text>
          Após deletar, não será possível a reversão do horário, apenas o
          marcando novamente.
        </Text>
        <Text type="warning">
          *** ATENÇÃO: Você está cancelando também os agendamentos recorrentes
        </Text>
      </div>
    ),
    cancelText: "Cancelar",
    onOk() {
      handleDelete(true);
    },
  };

  const handleOk = () => {
    setConfirmLoading(true);
    if (selectedAppointment?.id) {
      AppointmentService.updateAppointment(courtId, selectedAppointment)
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    } else {
      AppointmentService.addAppointment(courtId, {
        date: getUTCString(selectedDate) as string,
        time: selectedHour,
        customerName: selectedAppointment?.customerName,
        customerPhoneNumber: selectedAppointment?.customerPhoneNumber,
        price: selectedAppointment?.price,
        hasRecurrence: selectedAppointment?.hasRecurrence,
      } as Appointment)
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };

  const handleDelete = (removeRecurrence: boolean) => {
    if (selectedAppointment?.id) {
      AppointmentService.deleteAppointment(
        courtId,
        selectedAppointment.id,
        selectedAppointment.hasRecurrence && removeRecurrence
      )
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        });
    }
  };

  const confirm = () => {
    setOpenPopconfirm(false);
    Modal.confirm(ConfirmWithRecurrenceModal);
  };

  const cancel = () => {
    setOpenPopconfirm(false);
    Modal.confirm(ConfirmModal);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setOpenPopconfirm(newOpen);
      return;
    }
    // Determining condition before show the popconfirm.
    if (selectedAppointment?.hasRecurrence) {
      setOpenPopconfirm(newOpen);
    } else {
      cancel(); // next step
    }
  };

  return (
    <>
      {contextHolder}
      {currentStep === ModalSteps.step1 && (
        <div className={styles.end}>
          <Button key="back" onClick={resetModal}>
            Fechar
          </Button>
        </div>
      )}
      {currentStep === ModalSteps.step2 && (
        <div className={styles.space}>
          <Popconfirm
            title="Agendamento com recorrência"
            description="Cancelar também os agendamentos recorrentes?"
            open={openPopconfirm}
            onOpenChange={handleOpenChange}
            onConfirm={confirm}
            onCancel={cancel}
            okText="Sim"
            cancelText="Não"
          >
            <Button danger type="text" disabled={!selectedAppointment?.id}>
              Cancelar horário
            </Button>
          </Popconfirm>

          <div className={styles.gap}>
            <Button
              key="back"
              onClick={() =>
                fromFreeCourts ? resetModal() : setCurrentStep(ModalSteps.step1)
              }
            >
              {fromFreeCourts ? "Fechar" : "Voltar"}
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={handleOk}
              disabled={
                !selectedAppointment?.customerName ||
                !selectedAppointment?.customerPhoneNumber ||
                !selectedAppointment?.price
              }
            >
              Ok
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomFooter;

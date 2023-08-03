import styles from "./styles.module.css";
import { ModalSteps } from "./shared";
import { Button, Modal, Typography } from "antd";
import { Appointment } from "@/services/appointment/interfaces";
import { AppointmentService } from "@/services/appointment";
import { AxiosResponse } from "axios";
import { getUTCString } from "@/utils/date";
import { ExclamationCircleFilled } from "@ant-design/icons";

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

  const OkModal = {
    title: "Alterações salvas!",
    content: (
      <Text>
        Agendamento {selectedAppointment?.id ? "editado" : "adicionado"} com
        sucesso.
      </Text>
    ),
    onOk() {
      window.location.reload();
    },
  };

  const ErrorModal = {
    title: "Erro!",
    content: (
      <Text>
        Não foi possível {selectedAppointment?.id ? "editar" : "adicionar"}{" "}
        agendamento.
      </Text>
    ),
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

  const handleOk = () => {
    setConfirmLoading(true);
    if (selectedAppointment?.id) {
      AppointmentService.updateAppointment(courtId, selectedAppointment)
        .then((response: AxiosResponse) => {
          if (![200, 201, 204].includes(response.status)) throw Error;
          Modal.info(OkModal);
        })
        .catch((err) => {
          console.log(err);
          Modal.error(ErrorModal);
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
        recurrenceType: selectedAppointment?.recurrenceType,
      } as Appointment)
        .then((response: AxiosResponse) => {
          if (![200, 201, 204].includes(response.status)) throw Error;
          Modal.info(OkModal);
        })
        .catch((err) => {
          console.log(err);
          Modal.error(ErrorModal);
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    }
  };

  const handleDelete = () => {
    if (selectedAppointment?.id) {
      AppointmentService.deleteAppointment(courtId, selectedAppointment.id)
        .then((response: AxiosResponse) => {
          if (![200, 201, 204].includes(response.status)) throw Error;
          Modal.info(OkModal);
        })
        .catch((err) => {
          console.log(err);
          Modal.error(ErrorModal);
        });
    }
  };

  return (
    <>
      {currentStep === ModalSteps.step1 && (
        <div className={styles.end}>
          <Button key="back" onClick={resetModal}>
            Fechar
          </Button>
        </div>
      )}
      {currentStep === ModalSteps.step2 && (
        <div className={styles.space}>
          <Button
            danger
            type="text"
            disabled={!selectedAppointment?.id}
            onClick={() => Modal.confirm(ConfirmModal)}
          >
            Cancelar horário
          </Button>
          <div>
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

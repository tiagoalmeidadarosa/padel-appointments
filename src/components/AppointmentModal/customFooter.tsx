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
  selectedCustomerName: string | undefined;
  selectedCustomerPhoneNumber: string | undefined;
  selectedDate: Date;
  selectedHour: string | undefined;
  setCurrentStep: React.Dispatch<React.SetStateAction<ModalSteps>>;
  setConfirmLoading: React.Dispatch<React.SetStateAction<boolean>>;
  resetModal: () => void;
  onCancel: () => void;
};
const CustomFooter = ({
  courtId,
  currentStep,
  confirmLoading,
  selectedAppointment,
  selectedCustomerName,
  selectedCustomerPhoneNumber,
  selectedDate,
  selectedHour,
  setCurrentStep,
  setConfirmLoading,
  resetModal,
  onCancel,
}: Props) => {
  const { Text } = Typography;

  const OkModal = {
    title: "Alterações salvas!",
    content: <Text>Agendamento {!!selectedAppointment ? 'editado' : 'adicionado'} com sucesso.</Text>,
    onOk() {
      onCancel();
    },
  };

  const ErrorModal = {
    title: "Erro!",
    content: <Text>Não foi possível {!!selectedAppointment ? 'editar' : 'adicionar'} agendamento.</Text>,
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

  return (
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
};

export default CustomFooter;

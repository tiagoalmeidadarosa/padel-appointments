import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import {
  Button,
  Drawer,
  Typography,
  Modal,
  notification,
  Popconfirm,
  Checkbox,
  Input,
  InputNumber,
  Spin,
  Space,
  TimePicker,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { AppointmentService } from "@/services/appointment";
import {
  Appointment,
  Schedule,
  AppointmentRequest,
  UpdateAppointmentRequest,
} from "@/services/appointment/interfaces";
import { getHours, getUTCString } from "@/utils/date";
import { phoneMask } from "@/utils/string";
import { AxiosResponse } from "axios";
import { ModalSteps } from "../../shared";
import {
  LeftOutlined,
  RightOutlined,
  CheckSquareOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { addDays } from "@/utils/date";
import moment from "moment";
import "moment/locale/pt-br";
import ItemsConsumedTable from "../ItemsConsumedTable";
import Total from "../Total";
import { CheckService } from "@/services/check";
import { Agenda, CheckRequest } from "@/shared/interfaces";

type Props = {
  show: boolean;
  onCancel: () => void;
  preSelectedAgenda: Agenda | null;
};
export default function AgendaDrawer(props: Props) {
  const { onCancel, show, preSelectedAgenda } = props;
  const [api, contextHolder] = notification.useNotification();

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(
    preSelectedAgenda
  );

  const resetModal = () => {
    onCancel();
  };

  const CustomTitle = () => {
    const { Text } = Typography;
    moment.locale("pt-br");

    return (
      <div className={styles.center}>
        <Text>
          {selectedAgenda ? `Agenda ${selectedAgenda.name}` : "Nova agenda"}
        </Text>
      </div>
    );
  };

  // const CustomFooter = () => {
  //   const { Text } = Typography;

  //   const [openPopconfirm, setOpenPopconfirm] = useState(false);

  //   const isEditing = !!selectedAppointment?.id;
  //   type NotificationType = "success" | "info" | "warning" | "error";

  //   const openNotification = (type: NotificationType) => {
  //     const placement = "topLeft";
  //     if (type === "error") {
  //       api[type]({
  //         message: "Erro!",
  //         description: (
  //           <Text>
  //             Não foi possível {isEditing ? "editar" : "adicionar"} agendamento.
  //           </Text>
  //         ),
  //         placement,
  //       });
  //     } else {
  //       api[type]({
  //         message: "Alterações salvas!",
  //         description: (
  //           <Text>
  //             Agendamento {isEditing ? "editado" : "adicionado"} com sucesso.
  //           </Text>
  //         ),
  //         placement,
  //       });
  //       setTimeout(function () {
  //         window.location.reload();
  //       }, 3000);
  //     }
  //   };

  //   const ConfirmModal = {
  //     title: "Você deseja realmente cancelar esse agendamento?",
  //     content: (
  //       <Text>
  //         Após deletar, não será possível a reversão do horário, apenas o
  //         marcando novamente.
  //       </Text>
  //     ),
  //     cancelText: "Cancelar",
  //     onOk() {
  //       handleDelete(false);
  //     },
  //   };

  //   const ConfirmWithRecurrenceModal = {
  //     title: "Você deseja realmente cancelar esse agendamento?",
  //     content: (
  //       <div className={styles.input}>
  //         <Text>
  //           Após deletar, não será possível a reversão do horário, apenas o
  //           marcando novamente.
  //         </Text>
  //         <Text type="warning">
  //           *** ATENÇÃO: Você está cancelando também os agendamentos recorrentes
  //         </Text>
  //       </div>
  //     ),
  //     cancelText: "Cancelar",
  //     onOk() {
  //       handleDelete(true);
  //     },
  //   };

  //   const handleSave = () => {
  //     setConfirmLoading(true);
  //     if (isEditing) {
  //       AppointmentService.updateAppointment(selectedAppointment.id, {
  //         customerName: selectedAppointment.customerName,
  //         customerPhoneNumber: selectedAppointment.customerPhoneNumber,
  //         price: selectedAppointment.price,
  //       } as UpdateAppointmentRequest)
  //         .then(() => openNotification("success"))
  //         .catch((err) => {
  //           console.log(err);
  //           openNotification("error");
  //         })
  //         .finally(() => {
  //           setConfirmLoading(false);
  //         });
  //     } else {
  //       AppointmentService.addAppointment({
  //         date: getUTCString(selectedDate) as string,
  //         customerName: selectedAppointment?.customerName,
  //         customerPhoneNumber: selectedAppointment?.customerPhoneNumber,
  //         price: selectedAppointment?.price,
  //         hasRecurrence: selectedAppointment?.hasRecurrence,
  //         schedules: selectedSchedules,
  //       } as AppointmentRequest)
  //         .then(() => openNotification("success"))
  //         .catch((err) => {
  //           console.log(err);
  //           openNotification("error");
  //         })
  //         .finally(() => {
  //           setConfirmLoading(false);
  //         });
  //     }
  //   };

  //   const handleSaveCheck = () => {
  //     let check = selectedAppointment?.check;
  //     if (!check?.id) return;
  //     setConfirmLoading(true);
  //     CheckService.updateCheck(check.id, {
  //       priceDividedBy: check.priceDividedBy,
  //       pricePaidFor: check.pricePaidFor,
  //       itemsConsumed: check.itemsConsumed,
  //     } as CheckRequest)
  //       .then(() => openNotification("success"))
  //       .catch((err) => {
  //         console.log(err);
  //         openNotification("error");
  //       })
  //       .finally(() => {
  //         setConfirmLoading(false);
  //       });
  //   };

  //   const handleDelete = (removeRecurrence: boolean) => {
  //     if (selectedAppointment?.id) {
  //       AppointmentService.deleteAppointment(
  //         selectedAppointment?.id,
  //         selectedSchedules[0].id,
  //         selectedAppointment.hasRecurrence && removeRecurrence
  //       )
  //         .then(() => openNotification("success"))
  //         .catch((err) => {
  //           console.log(err);
  //           openNotification("error");
  //         });
  //     }
  //   };

  //   const confirm = () => {
  //     setOpenPopconfirm(false);
  //     Modal.confirm(ConfirmWithRecurrenceModal);
  //   };

  //   const cancel = () => {
  //     setOpenPopconfirm(false);
  //     Modal.confirm(ConfirmModal);
  //   };

  //   const handleOpenChange = (newOpen: boolean) => {
  //     if (!isEditing) return;
  //     if (!newOpen) {
  //       setOpenPopconfirm(newOpen);
  //       return;
  //     }
  //     // Determining condition before show the popconfirm.
  //     if (selectedAppointment?.hasRecurrence) {
  //       setOpenPopconfirm(newOpen);
  //     } else {
  //       cancel(); // next step
  //     }
  //   };

  //   return (
  //     <>
  //       {currentStep === ModalSteps.step1 && (
  //         <Space className={styles.end}>
  //           <Button key="back" onClick={resetModal}>
  //             Fechar
  //           </Button>
  //           <Button
  //             key="next"
  //             type="primary"
  //             onClick={() => {
  //               setSelectedAppointment(null);
  //               setCurrentStep(ModalSteps.step2);
  //             }}
  //             disabled={selectedSchedules.length === 0}
  //           >
  //             Reservar
  //           </Button>
  //         </Space>
  //       )}
  //       {currentStep === ModalSteps.step2 && (
  //         <div className={styles.space}>
  //           <Popconfirm
  //             title="Agendamento com recorrência"
  //             description="Cancelar também os agendamentos recorrentes?"
  //             open={openPopconfirm}
  //             onOpenChange={handleOpenChange}
  //             onConfirm={confirm}
  //             onCancel={cancel}
  //             okText="Sim"
  //             cancelText="Não, somente esse"
  //           >
  //             <Button danger type="text" disabled={!isEditing}>
  //               Cancelar horário
  //             </Button>
  //           </Popconfirm>

  //           <div className={styles.gap}>
  //             <Button
  //               key="back"
  //               onClick={() => {
  //                 if (isEditing) {
  //                   setSelectedSchedules([]);
  //                 }
  //                 if (fromViewByList) {
  //                   resetModal();
  //                 } else {
  //                   setCurrentStep(ModalSteps.step1);
  //                 }
  //               }}
  //             >
  //               {fromViewByList ? "Fechar" : "Voltar"}
  //             </Button>
  //             <Button
  //               key="submit"
  //               type="primary"
  //               loading={confirmLoading}
  //               onClick={handleSave}
  //               disabled={
  //                 !selectedAppointment?.customerName ||
  //                 !selectedAppointment?.customerPhoneNumber ||
  //                 !selectedAppointment?.price
  //               }
  //             >
  //               Salvar
  //             </Button>
  //           </div>
  //         </div>
  //       )}
  //       {currentStep === ModalSteps.step3 && (
  //         <Space className={styles.end}>
  //           <Button key="back" onClick={() => setCurrentStep(ModalSteps.step2)}>
  //             Voltar
  //           </Button>
  //           <Button
  //             key="submit"
  //             type="primary"
  //             loading={confirmLoading}
  //             onClick={handleSaveCheck}
  //           >
  //             Salvar
  //           </Button>
  //         </Space>
  //       )}
  //     </>
  //   );
  // };

  const CustomContent = (
    agenda: Agenda | null,
    setAgenda: React.Dispatch<React.SetStateAction<Agenda | null>>
  ) => {
    const { Text } = Typography;

    const isEditing = !!agenda?.id;

    return (
      <>
        <div className={styles.content}>
          <div className={styles.inputs}>
            <div className={styles.input}>
              <Text strong>{"Nome (obrigatório):"}</Text>
              <Input
                placeholder={"Digite o nome"}
                value={agenda?.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setAgenda(
                    (prevAgenda) =>
                      ({
                        ...prevAgenda,
                        name: e.target.value,
                      } as Agenda)
                  );
                }}
              />
            </div>
            <div className={styles.input}>
              <Text strong>{"Início e término (obrigatório):"}</Text>
              <TimePicker.RangePicker
                placeholder={["Data de início", "Data de fim"]}
                showSecond={false}
                minuteStep={30}
                hourStep={1}
                // value={[agenda?.startsAt, agenda?.endsAt]}
                onChange={(dates: any, dateStrings: [string, string]) => {
                  setAgenda(
                    (prevAgenda) =>
                      ({
                        ...prevAgenda,
                        startsAt: dateStrings[0],
                        endsAt: dateStrings[1],
                      } as Agenda)
                  );
                }}
              />
            </div>
            {/* <div className={styles.input}>
              <Text strong>{"Intervalo entre horários (obrigatório):"}</Text>
              <div className={styles.alignCenter}>
                <InputNumber
                  min={0}
                  value={agenda?.price}
                  formatter={(value: number | undefined) =>
                    `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value: string | undefined) =>
                    value ? parseFloat(value?.replace(/\R\$\s?|(,*)/g, "")) : 0
                  }
                  onChange={(value: number | null) => {
                    setAgenda(
                      (prevAgenda) =>
                        ({
                          ...prevAgenda,
                          price: value,
                        } as Agenda)
                    );
                  }}
                />
              </div>
            </div> */}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={show}
        placement="right"
        onClose={resetModal}
        closable={false}
        title={<CustomTitle />}
        // footer={<CustomFooter />}
      >
        {CustomContent(selectedAgenda, setSelectedAgenda)}
      </Drawer>
    </>
  );
}

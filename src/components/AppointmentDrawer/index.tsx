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
import { CheckRequest } from "@/services/check/interfaces";

type Props = {
  show: boolean;
  courtId: number;
  onCancel: () => void;
};
export default function AppointmentModal(props: Props) {
  const { onCancel, courtId, show } = props;

  const [api, contextHolder] = notification.useNotification();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.step1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  useEffect(() => {
    if (courtId && selectedDate) {
      setIsLoading(true);
      AppointmentService.getSchedules(
        courtId,
        getUTCString(selectedDate) as string
      )
        .then((response: AxiosResponse<Schedule[]>) => {
          setSchedules(response.data);
        })
        .catch((err) => {
          console.log(err);
          setSchedules([] as Schedule[]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [courtId, selectedDate]);

  const resetModal = () => {
    setSelectedDate(new Date());
    setSelectedSchedules([]);
    setCurrentStep(ModalSteps.step1);
    onCancel();
  };

  const CustomTitle = () => {
    const { Text } = Typography;
    moment.locale("pt-br");

    const handleChangeDate = (days: number) => {
      setSelectedSchedules([]);
      setSelectedDate((prev) => addDays(prev, days));
    };

    return (
      <>
        {currentStep === ModalSteps.step1 && (
          <div className={`${styles.space} ${styles.centralizedItems}`}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => handleChangeDate(-1)}
              disabled={new Date().getDate() === selectedDate.getDate()}
            />
            <Text>{`Quadra ${courtId} - ${
              moment(selectedDate).format("llll").split(" às")[0]
            }`}</Text>
            <Button
              type="text"
              icon={<RightOutlined />}
              onClick={() => handleChangeDate(1)}
            />
          </div>
        )}
        {currentStep === ModalSteps.step2 && (
          <div className={styles.center}>
            <Text>{`Quadra ${courtId} - ${
              moment(selectedDate).format("llll").split(" às")[0]
            } ${selectedSchedules
              .flatMap((s) => s.time.substring(0, s.time.lastIndexOf(":")))
              .join(", ")}`}</Text>
          </div>
        )}
        {currentStep === ModalSteps.step3 && (
          <div className={styles.center}>
            <Text>{`Comanda #${selectedAppointment?.check.id}`}</Text>
          </div>
        )}
      </>
    );
  };

  const CustomFooter = () => {
    const { Text } = Typography;

    const [openPopconfirm, setOpenPopconfirm] = useState(false);

    const isEditing = !!selectedAppointment?.id;
    type NotificationType = "success" | "info" | "warning" | "error";

    const openNotification = (type: NotificationType) => {
      const placement = "topLeft";
      if (type === "error") {
        api[type]({
          message: "Erro!",
          description: (
            <Text>
              Não foi possível {isEditing ? "editar" : "adicionar"} agendamento.
            </Text>
          ),
          placement,
        });
      } else {
        api[type]({
          message: "Alterações salvas!",
          description: (
            <Text>
              Agendamento {isEditing ? "editado" : "adicionado"} com sucesso.
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
          Após deletar, não será possível a reversão do horário, apenas o
          marcando novamente.
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

    const handleSave = () => {
      setConfirmLoading(true);
      if (isEditing) {
        AppointmentService.updateAppointment(selectedAppointment.id, {
          customerName: selectedAppointment.customerName,
          customerPhoneNumber: selectedAppointment.customerPhoneNumber,
          price: selectedAppointment.price,
        } as UpdateAppointmentRequest)
          .then(() => openNotification("success"))
          .catch((err) => {
            console.log(err);
            openNotification("error");
          })
          .finally(() => {
            setConfirmLoading(false);
          });
      } else {
        AppointmentService.addAppointment({
          date: getUTCString(selectedDate) as string,
          customerName: selectedAppointment?.customerName,
          customerPhoneNumber: selectedAppointment?.customerPhoneNumber,
          price: selectedAppointment?.price,
          hasRecurrence: selectedAppointment?.hasRecurrence,
          schedules: selectedSchedules,
        } as AppointmentRequest)
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

    const handleSaveCheck = () => {
      let check = selectedAppointment?.check;
      if (!check?.id) return;
      setConfirmLoading(true);
      CheckService.updateCheck(check.id, {
        priceDividedBy: check.priceDividedBy,
        pricePaidFor: check.pricePaidFor,
        itemsConsumed: check.itemsConsumed,
      } as CheckRequest)
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        })
        .finally(() => {
          setConfirmLoading(false);
        });
    };

    const handleDelete = (removeRecurrence: boolean) => {
      if (selectedAppointment?.id) {
        AppointmentService.deleteAppointment(
          selectedAppointment?.id,
          selectedSchedules[0].id,
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
      if (!isEditing) return;
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
        {currentStep === ModalSteps.step1 && (
          <Space className={styles.end}>
            <Button key="back" onClick={resetModal}>
              Fechar
            </Button>
            <Button
              key="next"
              type="primary"
              onClick={() => {
                setSelectedAppointment({} as Appointment);
                setCurrentStep(ModalSteps.step2);
              }}
              disabled={selectedSchedules.length === 0}
            >
              Reservar
            </Button>
          </Space>
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
              cancelText="Não, somente esse"
            >
              <Button danger type="text" disabled={!isEditing}>
                Cancelar horário
              </Button>
            </Popconfirm>

            <div className={styles.gap}>
              <Button
                key="back"
                onClick={() => {
                  if (isEditing) {
                    setSelectedSchedules([]);
                  }
                  setCurrentStep(ModalSteps.step1);
                }}
              >
                Voltar
              </Button>
              <Button
                key="submit"
                type="primary"
                loading={confirmLoading}
                onClick={handleSave}
                disabled={
                  !selectedAppointment?.customerName ||
                  !selectedAppointment?.customerPhoneNumber ||
                  !selectedAppointment?.price
                }
              >
                Salvar
              </Button>
            </div>
          </div>
        )}
        {currentStep === ModalSteps.step3 && (
          <Space className={styles.end}>
            <Button key="back" onClick={() => setCurrentStep(ModalSteps.step2)}>
              Voltar
            </Button>
            <Button
              key="submit"
              type="primary"
              loading={confirmLoading}
              onClick={handleSaveCheck}
            >
              Salvar
            </Button>
          </Space>
        )}
      </>
    );
  };

  const CustomContent = (
    appointment: Appointment | undefined,
    setAppointment: React.Dispatch<
      React.SetStateAction<Appointment | undefined>
    >
  ) => {
    const { Text } = Typography;

    const isEditing = !!appointment?.id;

    const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      let value = (e.target as HTMLInputElement).value;
      setAppointment(
        (prevAppointment) =>
          ({
            ...prevAppointment,
            customerPhoneNumber: phoneMask(value),
          } as Appointment)
      );
    };

    return (
      <>
        <div className={styles.content}>
          {isLoading && <Spin />}
          {!isLoading && (
            <>
              {currentStep === ModalSteps.step1 && (
                <>
                  {getHours(8, 23).map((hour: string, index: number) => {
                    let hasSchedule =
                      schedules.find((s: Schedule) => s.time === hour) !==
                      undefined;
                    let isSelected = selectedSchedules.find(
                      (s) => s.time === hour
                    );
                    const getClassName = () => {
                      if (hasSchedule) {
                        return styles.grayButton;
                      } else if (isSelected) {
                        return styles.orangeButton;
                      }
                      return "";
                    };
                    return (
                      <Button
                        key={`hour_${index}`}
                        type={"primary"}
                        className={getClassName()}
                        icon={
                          isSelected && !hasSchedule ? (
                            <CheckSquareOutlined />
                          ) : (
                            <span />
                          )
                        }
                        onClick={() => {
                          if (hasSchedule && selectedSchedules.length > 0)
                            return;
                          if (hasSchedule) {
                            let schedule = schedules.find(
                              (s: Schedule) => s.time === hour
                            ) as Schedule;
                            setSelectedSchedules([schedule]);
                            setAppointment(schedule.appointment);
                            setCurrentStep(ModalSteps.step2);
                          } else {
                            if (isSelected) {
                              setSelectedSchedules((prevState) =>
                                prevState.filter((s) => s.time !== hour)
                              );
                            } else {
                              setSelectedSchedules((prevState) => [
                                ...prevState,
                                {
                                  date: getUTCString(selectedDate) as string,
                                  time: hour,
                                  courtId: courtId,
                                } as Schedule,
                              ]);
                            }
                          }
                        }}
                      >
                        {hour.substring(0, 5)}
                      </Button>
                    );
                  })}
                </>
              )}
              {currentStep === ModalSteps.step2 && (
                <div className={styles.inputs}>
                  <div className={styles.input}>
                    <Text strong>{"Nome (obrigatório):"}</Text>
                    <Input
                      placeholder={"Digite o nome"}
                      value={appointment?.customerName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAppointment(
                          (prevAppointment) =>
                            ({
                              ...prevAppointment,
                              customerName: e.target.value,
                            } as Appointment)
                        );
                      }}
                    />
                  </div>
                  <div className={styles.input}>
                    <Text strong>{"Telefone (obrigatório):"}</Text>
                    <Input
                      type="tel"
                      maxLength={15}
                      placeholder="Digite o telefone"
                      value={appointment?.customerPhoneNumber}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setAppointment(
                          (prevAppointment) =>
                            ({
                              ...prevAppointment,
                              customerPhoneNumber: e.target.value,
                            } as Appointment)
                        );
                      }}
                      onKeyUp={handlePhoneKeyPress}
                    />
                  </div>
                  <div className={styles.input}>
                    <Text strong>{"Preço (obrigatório):"}</Text>
                    <div className={styles.alignCenter}>
                      <InputNumber
                        min={0}
                        value={appointment?.price}
                        formatter={(value: number | undefined) =>
                          `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={(value: string | undefined) =>
                          value
                            ? parseFloat(value?.replace(/\R\$\s?|(,*)/g, ""))
                            : 0
                        }
                        onChange={(value: number | null) => {
                          setAppointment(
                            (prevAppointment) =>
                              ({
                                ...prevAppointment,
                                price: value,
                              } as Appointment)
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className={styles.input}>
                    <Checkbox
                      checked={appointment?.hasRecurrence}
                      onChange={(e: CheckboxChangeEvent) => {
                        setAppointment(
                          (prevAppointment) =>
                            ({
                              ...prevAppointment,
                              hasRecurrence: e.target.checked,
                            } as Appointment)
                        );
                      }}
                      disabled={isEditing}
                    >
                      <Text strong>{"Recorrência"}</Text>
                    </Checkbox>
                  </div>
                  {isEditing && (
                    <Button
                      type="link"
                      onClick={() => setCurrentStep(ModalSteps.step3)}
                      className={styles.floatButton}
                    >
                      {"Comanda"} <ArrowRightOutlined />
                    </Button>
                  )}
                </div>
              )}
              {currentStep === ModalSteps.step3 && (
                <div className={styles.inputs}>
                  <div className={styles.input}>
                    <Text strong>{"Itens consumidos:"}</Text>
                    <ItemsConsumedTable
                      appointment={appointment}
                      setAppointment={setAppointment}
                    />
                  </div>
                  <Total
                    appointment={appointment}
                    setAppointment={setAppointment}
                  />
                </div>
              )}
            </>
          )}
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
        footer={<CustomFooter />}
      >
        {CustomContent(selectedAppointment, setSelectedAppointment)}
      </Drawer>
    </>
  );
}

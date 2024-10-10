import React, { useState } from "react";
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
  Space,
  Form,
  Collapse,
} from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { AppointmentService } from "@/services/appointment";
import { getUTCString } from "@/utils/date";
import { phoneMask } from "@/utils/string";
import { ModalSteps } from "../../shared";
import { ArrowRightOutlined } from "@ant-design/icons";
import moment from "moment";
import "moment/locale/pt-br";
import ItemsConsumedTable from "../ItemsConsumedTable";
import Total from "../Total";
import { CheckService } from "@/services/check";
import { Appointment, Schedule, CheckRequest } from "@/shared/interfaces";

type Props = {
  show: boolean;
  agendaId: number;
  onCancel: () => void;
  preSelectedDate?: Date | undefined;
  preSelectedSchedules?: Schedule[] | undefined;
  preSelectedAppointment: Appointment | null;
};
export default function AppointmentDrawer(props: Props) {
  const {
    onCancel,
    agendaId,
    show,
    preSelectedDate,
    preSelectedSchedules,
    preSelectedAppointment,
  } = props;
  const [api, contextHolder] = notification.useNotification();

  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.step1);
  const [selectedDate, setSelectedDate] = useState<Date>(
    preSelectedDate || new Date()
  );
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>(
    preSelectedSchedules || []
  );
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(preSelectedAppointment);

  const resetModal = () => {
    setSelectedDate(new Date());
    setSelectedSchedules([]);
    setCurrentStep(ModalSteps.step1);
    onCancel();
  };

  const CustomTitle = (step: ModalSteps) => {
    const { Text } = Typography;
    moment.locale("pt-br");

    return (
      <>
        {step === ModalSteps.step1 && (
          <div className={styles.center}>
            <Text>{`Quadra ${agendaId} - ${
              moment(selectedDate).format("llll").split(" às")[0]
            } ${selectedSchedules
              .flatMap((s) => s.time.substring(0, s.time.lastIndexOf(":")))
              .join(", ")}`}</Text>
          </div>
        )}
        {step === ModalSteps.step2 && (
          <div className={styles.center}>
            <Text>{`Comanda #${selectedAppointment?.check.id}`}</Text>
          </div>
        )}
      </>
    );
  };

  const CustomFooter = (step: ModalSteps) => {
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
        }, 1500);
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
        AppointmentService.updateAppointment(selectedAppointment)
          .then(() => openNotification("success"))
          .catch((err) => {
            console.log(err);
            openNotification("error");
          })
          .finally(() => {
            setConfirmLoading(false);
          });
      } else {
        AppointmentService.addAppointment(
          getUTCString(selectedDate) as string,
          selectedAppointment,
          selectedSchedules,
          agendaId
        )
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
        {step === ModalSteps.step1 && (
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
                  resetModal();
                }}
              >
                Fechar
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
        {step === ModalSteps.step2 && (
          <Space className={styles.end}>
            <Button key="back" onClick={() => setCurrentStep(ModalSteps.step1)}>
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

  const CustomContent = (step: ModalSteps) => {
    const { Text } = Typography;

    const [form] = Form.useForm();

    const isEditing = !!selectedAppointment?.id;

    const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const value = (e.target as HTMLInputElement).value;
      const maskedValue = phoneMask(value);
      setSelectedAppointment(
        (prevAppointment) =>
          ({
            ...prevAppointment,
            customerPhoneNumber: maskedValue,
          } as Appointment)
      );
      form.setFieldValue("customerPhoneNumber", maskedValue);
    };

    return (
      <>
        {step === ModalSteps.step1 && (
          <Form form={form} name="basic" layout="vertical" autoComplete="off">
            <Form.Item<Appointment>
              label="Nome do cliente"
              name="customerName"
              rules={[{ required: true, message: "Por favor insira o nome!" }]}
              initialValue={selectedAppointment?.customerName}
            >
              <Input
                placeholder={"Digite o nome"}
                value={selectedAppointment?.customerName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedAppointment(
                    (prevAppointment) =>
                      ({
                        ...prevAppointment,
                        customerName: e.target.value,
                      } as Appointment)
                  );
                }}
              />
            </Form.Item>
            <Form.Item<Appointment>
              label="Telefone do cliente"
              name="customerPhoneNumber"
              rules={[
                { required: true, message: "Por favor insira o telefone!" },
              ]}
              initialValue={selectedAppointment?.customerPhoneNumber}
            >
              <Input
                type="tel"
                maxLength={15}
                placeholder="Digite o telefone"
                value={selectedAppointment?.customerPhoneNumber}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  setSelectedAppointment(
                    (prevAppointment) =>
                      ({
                        ...prevAppointment,
                        customerPhoneNumber: e.target.value,
                      } as Appointment)
                  );
                }}
                onKeyUp={handlePhoneKeyPress}
              />
            </Form.Item>
            <Form.Item<Appointment>
              label="Preço"
              name="price"
              rules={[{ required: true, message: "Por favor insira o preço!" }]}
              initialValue={selectedAppointment?.price}
            >
              <InputNumber
                min={0}
                value={selectedAppointment?.price}
                formatter={(value: number | undefined) =>
                  `R$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                parser={(value: string | undefined) =>
                  value ? parseFloat(value?.replace(/\R\$\s?|(,*)/g, "")) : 0
                }
                onChange={(value: number | null) => {
                  setSelectedAppointment(
                    (prevAppointment) =>
                      ({
                        ...prevAppointment,
                        price: value,
                      } as Appointment)
                  );
                }}
              />
            </Form.Item>
            <Form.Item<Appointment>
              name="hasRecurrence"
              initialValue={selectedAppointment?.hasRecurrence}
            >
              <Checkbox
                checked={selectedAppointment?.hasRecurrence}
                onChange={(e: CheckboxChangeEvent) => {
                  setSelectedAppointment(
                    (prevAppointment) =>
                      ({
                        ...prevAppointment,
                        hasRecurrence: e.target.checked,
                      } as Appointment)
                  );
                }}
                disabled={isEditing}
              >
                <Text>{"Recorrência"}</Text>
              </Checkbox>
            </Form.Item>
            {isEditing && (
              <Button
                type="link"
                onClick={() => setCurrentStep(ModalSteps.step2)}
                className={styles.floatButton}
              >
                {"Comanda"} <ArrowRightOutlined />
              </Button>
            )}
          </Form>
        )}
        {step === ModalSteps.step2 && (
          <Collapse defaultActiveKey={["1"]}>
            <Collapse.Panel key="1" header="Itens consumidos">
              <ItemsConsumedTable
                appointment={selectedAppointment}
                setAppointment={setSelectedAppointment}
              />
            </Collapse.Panel>
            <Collapse.Panel key="2" header="### Totais:">
              <Total
                appointment={selectedAppointment}
                setAppointment={setSelectedAppointment}
              />
            </Collapse.Panel>
          </Collapse>
        )}
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
        title={CustomTitle(ModalSteps.step1)}
        footer={CustomFooter(ModalSteps.step1)}
      >
        {CustomContent(ModalSteps.step1)}
        <Drawer
          open={show && currentStep === ModalSteps.step2}
          placement="right"
          onClose={() => setCurrentStep(ModalSteps.step1)}
          closable={false}
          title={CustomTitle(ModalSteps.step2)}
          footer={CustomFooter(ModalSteps.step2)}
        >
          {CustomContent(ModalSteps.step2)}
        </Drawer>
      </Drawer>
    </>
  );
}

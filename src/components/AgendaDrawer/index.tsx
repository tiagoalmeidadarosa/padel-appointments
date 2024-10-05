import React, { useState } from "react";
import styles from "./styles.module.css";
import {
  Button,
  Drawer,
  Typography,
  notification,
  Input,
  Space,
  TimePicker,
  Select,
} from "antd";
import { AgendaService } from "@/services/agenda";
import moment from "moment";
import "moment/locale/pt-br";
import { Agenda, AgendaRequest } from "@/shared/interfaces";
import dayjs from "dayjs";

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
          {preSelectedAgenda
            ? `Agenda ${preSelectedAgenda.name}`
            : "Nova agenda"}
        </Text>
      </div>
    );
  };

  const CustomFooter = (agenda: Agenda | null) => {
    const { Text } = Typography;

    const isEditing = !!agenda?.id;
    type NotificationType = "success" | "info" | "warning" | "error";

    const openNotification = (type: NotificationType) => {
      const placement = "topLeft";
      if (type === "error") {
        api[type]({
          message: "Erro!",
          description: (
            <Text>
              Não foi possível {isEditing ? "editar" : "adicionar"} agenda.
            </Text>
          ),
          placement,
        });
      } else {
        api[type]({
          message: "Alterações salvas!",
          description: (
            <Text>
              Agenda {isEditing ? "editada" : "adicionada"} com sucesso.
            </Text>
          ),
          placement,
        });
        setTimeout(function () {
          window.location.reload();
        }, 3000);
      }
    };

    const handleSave = () => {
      setConfirmLoading(true);
      if (isEditing) {
        // AgendaService.updateAgenda(agenda.id, {
        //   customerName: agenda.name,
        // } as UpdateAppointmentRequest)
        //   .then(() => openNotification("success"))
        //   .catch((err) => {
        //     console.log(err);
        //     openNotification("error");
        //   })
        //   .finally(() => {
        //     setConfirmLoading(false);
        //   });
      } else {
        AgendaService.addAgenda({
          name: agenda?.name,
          startsAt: agenda?.startsAt,
          endsAt: agenda?.endsAt,
          interval: agenda?.interval,
        } as AgendaRequest)
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

    return (
      <Space className={styles.end}>
        <Button key="back" onClick={resetModal}>
          Voltar
        </Button>
        <Button
          key="submit"
          type="primary"
          loading={confirmLoading}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </Space>
    );
  };

  const CustomContent = (
    agenda: Agenda | null,
    setAgenda: React.Dispatch<React.SetStateAction<Agenda | null>>
  ) => {
    const { Text } = Typography;

    return (
      <>
        <div className={styles.content}>
          <div className={styles.inputs}>
            <div className={styles.input}>
              <div>
                <Text strong>{"Nome:"}</Text>
                <Text style={{ color: "#ff4d4f" }}>{` *`}</Text>
              </div>
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
              <div>
                <Text strong>{"Início e término:"}</Text>
                <Text style={{ color: "#ff4d4f" }}>{` *`}</Text>
              </div>
              <TimePicker.RangePicker
                placeholder={["Data de início", "Data de fim"]}
                hourStep={1}
                minuteStep={30}
                showSecond={false}
                value={
                  agenda?.startsAt && agenda?.endsAt
                    ? [
                        dayjs(agenda?.startsAt, "HH:mm:ss"),
                        dayjs(agenda?.endsAt, "HH:mm:ss"),
                      ]
                    : undefined
                }
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
            <div className={styles.input}>
              <div>
                <Text strong>{"Intervalo entre horários:"}</Text>
                <Text style={{ color: "#ff4d4f" }}>{` *`}</Text>
              </div>
              <Select
                placeholder={"Selecione o intervalo"}
                value={agenda?.interval}
                onChange={(value: string) => {
                  setAgenda(
                    (prevAgenda) =>
                      ({
                        ...prevAgenda,
                        interval: value,
                      } as Agenda)
                  );
                }}
                options={[
                  { value: "00:30:00", label: "30 minutos" },
                  { value: "01:00:00", label: "1 hora" },
                ]}
              />
            </div>
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
        footer={CustomFooter(selectedAgenda)}
      >
        {CustomContent(selectedAgenda, setSelectedAgenda)}
      </Drawer>
    </>
  );
}

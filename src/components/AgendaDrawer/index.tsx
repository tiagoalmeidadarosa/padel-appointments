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
  Form,
  Modal,
} from "antd";
import { AgendaService } from "@/services/agenda";
import "moment/locale/pt-br";
import { Agenda } from "@/shared/interfaces";
import dayjs from "dayjs";

type Props = {
  show: boolean;
  onCancel: () => void;
  preSelectedAgenda: Agenda | null;
};

type NotificationType = "success" | "info" | "warning" | "error";

export default function AgendaDrawer(props: Props) {
  const { onCancel, show, preSelectedAgenda } = props;
  const { Text } = Typography;

  const [api, contextHolder] = notification.useNotification();

  const [agenda, setAgenda] = useState<Agenda | null>(preSelectedAgenda);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const isEditing = !!agenda?.id;

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
      }, 1500);
    }
  };

  const handleSave = () => {
    setIsSubmitting(true);
    if (isEditing) {
      AgendaService.updateAgenda(agenda)
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    } else {
      AgendaService.addAgenda(agenda)
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        })
        .finally(() => {
          setIsSubmitting(false);
        });
    }
  };

  return (
    <>
      {contextHolder}
      <Drawer
        open={show}
        placement="right"
        onClose={onCancel}
        closable={false}
        title={CustomTitle(preSelectedAgenda)}
        footer={CustomFooter(agenda, isSubmitting, onCancel, handleSave)}
      >
        {CustomContent(agenda, setAgenda)}
      </Drawer>
    </>
  );
}

const CustomTitle = (preSelectedAgenda: Agenda | null) => {
  const { Text } = Typography;

  return (
    <div className={styles.center}>
      <Text>
        {preSelectedAgenda ? `Agenda ${preSelectedAgenda.name}` : "Nova agenda"}
      </Text>
    </div>
  );
};

const CustomContent = (
  agenda: Agenda | null,
  setAgenda: React.Dispatch<React.SetStateAction<Agenda | null>>
) => {
  return (
    <Form name="basic" layout="vertical" autoComplete="off">
      <Form.Item<Agenda>
        label="Nome"
        name="name"
        rules={[{ required: true, message: "Por favor insira o nome!" }]}
        initialValue={agenda?.name}
      >
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
      </Form.Item>
      <Form.Item<Agenda>
        label="Início e término:"
        name="startsAtAndEndsAt"
        rules={[
          {
            required: true,
            message: "Por favor insira o ínicio e o término!",
          },
        ]}
        initialValue={
          agenda?.startsAt && agenda?.endsAt
            ? [
                dayjs(agenda.startsAt, "HH:mm:ss"),
                dayjs(agenda.endsAt, "HH:mm:ss"),
              ]
            : undefined
        }
      >
        <TimePicker.RangePicker
          placeholder={["Data de início", "Data de fim"]}
          hourStep={1}
          minuteStep={30}
          showSecond={false}
          value={
            agenda?.startsAt && agenda?.endsAt
              ? [
                  dayjs(agenda.startsAt, "HH:mm:ss"),
                  dayjs(agenda.endsAt, "HH:mm:ss"),
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
      </Form.Item>
      <Form.Item<Agenda>
        label="Intervalo entre horários:"
        name="interval"
        rules={[{ required: true, message: "Por favor insira o intervalo!" }]}
        initialValue={agenda?.interval}
      >
        <Select
          placeholder={"Selecione o intervalo"}
          value={agenda?.interval}
          onChange={(value: number) => {
            setAgenda(
              (prevAgenda) =>
                ({
                  ...prevAgenda,
                  interval: value,
                } as Agenda)
            );
          }}
          options={[
            { value: 30, label: "30 minutos" },
            { value: 60, label: "1 hora" },
          ]}
        />
      </Form.Item>
    </Form>
  );
};

const CustomFooter = (
  agenda: Agenda | null,
  isSubmitting: boolean,
  onCancel: () => void,
  handleSave: () => void
) => {
  const { Text } = Typography;

  const [api, contextHolder] = notification.useNotification();

  const isEditing = !!agenda?.id;

  const openNotification = (type: NotificationType) => {
    const placement = "topLeft";
    if (type === "error") {
      api[type]({
        message: "Erro!",
        description: <Text>Não foi possível deletar agenda.</Text>,
        placement,
      });
    } else {
      api[type]({
        message: "Alterações salvas!",
        description: <Text>Agenda deletada com sucesso.</Text>,
        placement,
      });
      setTimeout(function () {
        window.location.reload();
      }, 1500);
    }
  };

  const ConfirmModal = {
    title: "Você deseja realmente deletar essa agenda?",
    content: <Text>Após deletar não será possível reverter.</Text>,
    cancelText: "Cancelar",
    onOk() {
      handleDelete();
    },
  };

  const handleDelete = () => {
    if (agenda?.id) {
      AgendaService.deleteAgenda(agenda.id)
        .then(() => openNotification("success"))
        .catch((err) => {
          console.log(err);
          openNotification("error");
        });
    }
  };

  const onDelete = () => {
    Modal.confirm(ConfirmModal);
  };

  return (
    <>
      {contextHolder}
      <div className={styles.space}>
        <Button danger type="text" disabled={!isEditing} onClick={onDelete}>
          Deletar agenda
        </Button>
        <Space>
          <Button key="back" onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            key="submit"
            type="primary"
            loading={isSubmitting}
            onClick={handleSave}
          >
            Salvar
          </Button>
        </Space>
      </div>
    </>
  );
};

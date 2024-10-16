import React, { Fragment, useEffect, useState } from "react";
import styles from "./styles.module.css";
import { Button, Divider, Empty, Space, Spin, Typography } from "antd";
import {
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
  PlusOutlined,
  EditOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { addDays, getHours, getUTCString } from "@/utils/date";
import { AgendaService } from "@/services/agenda";
import { AxiosResponse } from "axios";
import { Appointment, Schedule, Agenda } from "@/shared/interfaces";
import { CheckSquareOutlined } from "@ant-design/icons";
import AppointmentDrawer from "../AppointmentDrawer";
import AgendaDrawer from "../AgendaDrawer";

const BackgroundViewByList = () => {
  const { Text } = Typography;

  const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
  const [openAgendaModal, setOpenAgendaModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([]);
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [selectedAgenda, setSelectedAgenda] = useState<Agenda | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [agendas, setAgendas] = useState<Agenda[]>([]);

  useEffect(() => {
    setIsLoading(true);
    AgendaService.getAgendas()
      .then((response: AxiosResponse<Agenda[]>) => {
        setAgendas(response.data);
      })
      .catch((err) => {
        console.log(err);
        setAgendas([] as Agenda[]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChangeDate = (days: number) => {
    setSelectedSchedules([]);
    setSelectedDate((prev) => addDays(prev, days));
  };

  const handleNextAppointment = (
    courtId: number,
    schedules: Schedule[],
    appointment: Appointment | null
  ) => {
    setSelectedCourtId(courtId);
    setSelectedSchedules(schedules);
    setSelectedAppointment(appointment);
    setOpenAppointmentModal(true);
  };

  const handleNextAgenda = (agenda: Agenda | null) => {
    setSelectedAgenda(agenda);
    setOpenAgendaModal(true);
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => handleChangeDate(-1)}
            disabled={new Date().getDate() === selectedDate.getDate()}
          />
          <Text strong>{`${
            moment(selectedDate).format("LLLL").split(" às")[0]
          }`}</Text>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => handleChangeDate(1)}
          />
        </div>
        <div className={styles.body}>
          <div className={styles.actions}>
            {selectedSchedules.length === 0 && (
              <Button
                type="link"
                icon={<PlusOutlined />}
                onClick={() => handleNextAgenda(null)}
              >
                Nova agenda
              </Button>
            )}
            {selectedSchedules.length > 0 && (
              <Button
                type="primary"
                className={styles.orangeButton}
                icon={<DoubleRightOutlined />}
                onClick={() =>
                  handleNextAppointment(
                    selectedSchedules[0].appointment.agendaId,
                    selectedSchedules,
                    null
                  )
                }
              >
                Agendamento
              </Button>
            )}
          </div>
          {isLoading && <Spin style={{ marginTop: "1rem" }} />}
          {!isLoading && agendas.length === 0 && (
            <Empty
              description="Nenhuma agenda"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
          {!isLoading && agendas.length > 0 && (
            <>
              {agendas.map((agenda) => (
                <Fragment key={agenda.id}>
                  <Divider orientation="left">
                    <Space>
                      <Text strong>{agenda.name}</Text>
                      <Button
                        type="link"
                        icon={<EditOutlined />}
                        onClick={() => handleNextAgenda(agenda)}
                      />
                    </Space>
                  </Divider>
                  <div className={styles.schedulesContainer}>
                    <Schedules
                      agenda={agenda}
                      selectedSchedules={selectedSchedules}
                      setSelectedSchedules={setSelectedSchedules}
                      selectedDate={selectedDate}
                      onNext={handleNextAppointment}
                    />
                  </div>
                </Fragment>
              ))}
            </>
          )}
        </div>
      </div>
      {openAppointmentModal && selectedCourtId && (
        <AppointmentDrawer
          show={openAppointmentModal}
          agendaId={selectedCourtId}
          onCancel={() => {
            setSelectedCourtId(undefined);
            setSelectedSchedules([]);
            setOpenAppointmentModal(false);
          }}
          preSelectedDate={selectedDate}
          preSelectedSchedules={selectedSchedules}
          preSelectedAppointment={selectedAppointment}
        />
      )}
      {openAgendaModal && (
        <AgendaDrawer
          show={openAgendaModal}
          onCancel={() => {
            setOpenAgendaModal(false);
          }}
          preSelectedAgenda={selectedAgenda}
        />
      )}
    </>
  );
};

type SchedulesProps = {
  agenda: Agenda;
  selectedSchedules: Schedule[];
  setSelectedSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  selectedDate: Date;
  onNext: (
    agendaId: number,
    schedules: Schedule[],
    appointment: Appointment | null
  ) => void;
};
const Schedules = (props: SchedulesProps) => {
  const {
    agenda,
    selectedSchedules,
    setSelectedSchedules,
    selectedDate,
    onNext,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    setIsLoading(true);
    AgendaService.getSchedules(agenda.id, getUTCString(selectedDate) as string)
      .then((response: AxiosResponse<Schedule[]>) => {
        setSchedules(response.data);
      })
      .catch((err) => {
        console.log(err);
        setSchedules([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [agenda.id, selectedDate]);

  return (
    <>
      {isLoading && <Spin />}
      {!isLoading && (
        <Space size={8} style={{ flexWrap: "wrap" }}>
          {getHours(agenda.startsAt, agenda.endsAt, agenda.interval).map(
            (hour: string, index: number) => {
              return (
                <Hour
                  key={`hour_${agenda.id}_${index}`}
                  agendaId={agenda.id}
                  schedules={schedules}
                  selectedSchedules={selectedSchedules}
                  setSelectedSchedules={setSelectedSchedules}
                  selectedDate={selectedDate}
                  hour={hour}
                  onNext={onNext}
                />
              );
            }
          )}
        </Space>
      )}
    </>
  );
};

type HourProps = {
  agendaId: number;
  schedules: Schedule[];
  selectedSchedules: Schedule[];
  setSelectedSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  selectedDate: Date;
  hour: string;
  onNext: (
    agendaId: number,
    schedules: Schedule[],
    appointment: Appointment | null
  ) => void;
};
const Hour = (props: HourProps) => {
  const {
    agendaId,
    schedules,
    selectedSchedules,
    setSelectedSchedules,
    selectedDate,
    onNext,
    hour,
  } = props;

  const selectedHour = `${hour}:00`;

  const hasSchedule =
    schedules.find((s: Schedule) => s.time === selectedHour) !== undefined;
  const isSelected = selectedSchedules.find(
    (s) => s.appointment.agendaId === agendaId && s.time === selectedHour
  );
  const getClassName = () => {
    if (hasSchedule) {
      return styles.grayButton;
    }
    if (isSelected) {
      return styles.orangeButton;
    }
    return "";
  };
  return (
    <Button
      type={"primary"}
      className={getClassName()}
      style={{ width: "90px" }}
      icon={isSelected && !hasSchedule ? <CheckSquareOutlined /> : <span />}
      onClick={() => {
        if (hasSchedule && selectedSchedules.length > 0) {
          return;
        }
        if (hasSchedule) {
          let schedule = schedules.find(
            (s: Schedule) => s.time === selectedHour
          ) as Schedule;
          onNext(agendaId, [schedule], schedule.appointment);
          return;
        }
        if (isSelected) {
          setSelectedSchedules((prevState) =>
            prevState.filter((s) => s.time !== selectedHour)
          );
          return;
        }

        if (
          selectedSchedules.find((s) => s.appointment.agendaId !== agendaId)
        ) {
          setSelectedSchedules([]);
        }
        setSelectedSchedules((prevState) => [
          ...prevState,
          {
            date: getUTCString(selectedDate) as string,
            time: selectedHour,
            appointment: {
              agendaId,
            } as Appointment,
          } as Schedule,
        ]);
      }}
    >
      {selectedHour.substring(0, 5)}
    </Button>
  );
};

export default BackgroundViewByList;

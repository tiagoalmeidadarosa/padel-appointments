import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { BackgroundType } from "../../shared";
import {
  Button,
  ConfigProvider,
  Divider,
  FloatButton,
  Space,
  Spin,
  Switch,
  Typography,
} from "antd";
import { signOut } from "next-auth/react";
import {
  LogoutOutlined,
  LeftOutlined,
  RightOutlined,
  DoubleRightOutlined,
} from "@ant-design/icons";
import moment from "moment";
import { Appointment, Schedule } from "@/services/appointment/interfaces";
import { addDays, getHours, getUTCString } from "@/utils/date";
import { CourtService } from "@/services/court";
import { AxiosResponse } from "axios";
import { Court } from "@/services/court/interfaces";
import { CheckSquareOutlined } from "@ant-design/icons";
import { AppointmentService } from "@/services/appointment";
import AppointmentModal from "../AppointmentDrawer";

type Props = {
  backgroundType: BackgroundType;
  onChangeBackgroundType: (backgroundType: BackgroundType) => void;
};
const BackgroundViewByList = (props: Props) => {
  const { Text } = Typography;
  const { backgroundType, onChangeBackgroundType } = props;

  const [openModal, setOpenModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedSchedules, setSelectedSchedules] = useState<Schedule[]>([]);
  const [selectedAppointment, setSelectedAppointment] = useState<
    Appointment | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courts, setCourts] = useState<Court[]>([]);

  useEffect(() => {
    setIsLoading(true);
    CourtService.getCourts()
      .then((response: AxiosResponse<Court[]>) => {
        setCourts(response.data);
      })
      .catch((err) => {
        console.log(err);
        setCourts([] as Court[]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const handleChangeDate = (days: number) => {
    setSelectedSchedules([]);
    setSelectedDate((prev) => addDays(prev, days));
  };

  const handleNext = (
    courtId: number,
    schedules: Schedule[],
    appointment: Appointment | undefined
  ) => {
    setSelectedCourtId(courtId);
    setSelectedSchedules(schedules);
    setSelectedAppointment(appointment);
    setOpenModal(true);
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
          {isLoading && <Spin style={{ marginTop: "1rem" }} />}
          {!isLoading && (
            <>
              {courts.map((court) => (
                <>
                  <Divider orientation="left">
                    <Text strong>{court.name}</Text>
                  </Divider>
                  <div className={styles.schedulesContainer}>
                    <Schedules
                      courtId={court.id}
                      selectedSchedules={selectedSchedules}
                      setSelectedSchedules={setSelectedSchedules}
                      selectedDate={selectedDate}
                      onNext={handleNext}
                    />
                  </div>
                </>
              ))}
            </>
          )}
        </div>
        <div className={styles.footer}>
          <Space>
            <Text>Visualização por lista</Text>
            <Switch
              size="small"
              checked={backgroundType === BackgroundType.list}
              onChange={() => onChangeBackgroundType(BackgroundType.image)}
            />
          </Space>
          <Button
            icon={<LogoutOutlined />}
            type="text"
            onClick={() => signOut()}
          >
            Logout
          </Button>
        </div>
        {selectedSchedules.length > 0 && (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: "#fa8c16",
              },
            }}
          >
            <FloatButton
              shape="square"
              type="primary"
              description="Reservar"
              icon={<DoubleRightOutlined />}
              onClick={() =>
                handleNext(
                  selectedSchedules[0].courtId,
                  selectedSchedules,
                  undefined
                )
              }
              style={{ width: "5rem" }}
            />
          </ConfigProvider>
        )}
      </div>
      {openModal && selectedCourtId && (
        <AppointmentModal
          show={openModal}
          courtId={selectedCourtId}
          onCancel={() => {
            setSelectedCourtId(undefined);
            setSelectedSchedules([]);
            setOpenModal(false);
          }}
          preSelectedDate={selectedDate}
          preSelectedSchedules={selectedSchedules}
          preSelectedAppointment={selectedAppointment}
        />
      )}
    </>
  );
};

type SchedulesProps = {
  courtId: number;
  selectedSchedules: Schedule[];
  setSelectedSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  selectedDate: Date;
  onNext: (
    courtId: number,
    schedules: Schedule[],
    appointment: Appointment | undefined
  ) => void;
};
const Schedules = (props: SchedulesProps) => {
  const { Text } = Typography;
  const {
    courtId,
    selectedSchedules,
    setSelectedSchedules,
    selectedDate,
    onNext,
  } = props;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
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
        setSchedules([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [courtId, selectedDate]);

  return (
    <>
      {isLoading && <Spin />}
      {!isLoading && (
        <>
          <Space size={4}>
            <div className={styles.timeShift}>
              <Text>Manhã:</Text>
            </div>
            {getHours(8, 13).map((hour: string, index: number) => {
              return (
                <Hour
                  key={`hour_${courtId}_${index}`}
                  courtId={courtId}
                  schedules={schedules}
                  selectedSchedules={selectedSchedules}
                  setSelectedSchedules={setSelectedSchedules}
                  selectedDate={selectedDate}
                  hour={hour}
                  onNext={onNext}
                />
              );
            })}
          </Space>
          <Space size={4}>
            <div className={styles.timeShift}>
              <Text>Tarde:</Text>
            </div>
            {getHours(13, 18).map((hour: string, index: number) => {
              return (
                <Hour
                  key={`hour_${courtId}_${index}`}
                  courtId={courtId}
                  schedules={schedules}
                  selectedSchedules={selectedSchedules}
                  setSelectedSchedules={setSelectedSchedules}
                  selectedDate={selectedDate}
                  hour={hour}
                  onNext={onNext}
                />
              );
            })}
          </Space>
          <Space size={4}>
            <div className={styles.timeShift}>
              <Text>Noite:</Text>
            </div>
            {getHours(18, 23).map((hour: string, index: number) => {
              return (
                <Hour
                  key={`hour_${courtId}_${index}`}
                  courtId={courtId}
                  schedules={schedules}
                  selectedSchedules={selectedSchedules}
                  setSelectedSchedules={setSelectedSchedules}
                  selectedDate={selectedDate}
                  hour={hour}
                  onNext={onNext}
                />
              );
            })}
          </Space>
        </>
      )}
    </>
  );
};

type HourProps = {
  courtId: number;
  schedules: Schedule[];
  selectedSchedules: Schedule[];
  setSelectedSchedules: React.Dispatch<React.SetStateAction<Schedule[]>>;
  selectedDate: Date;
  hour: string;
  onNext: (
    courtId: number,
    schedules: Schedule[],
    appointment: Appointment | undefined
  ) => void;
};
const Hour = (props: HourProps) => {
  const {
    courtId,
    schedules,
    selectedSchedules,
    setSelectedSchedules,
    selectedDate,
    onNext,
    hour,
  } = props;

  const hasSchedule =
    schedules.find((s: Schedule) => s.time === hour) !== undefined;
  const isSelected = selectedSchedules.find(
    (s) => s.courtId === courtId && s.time === hour
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
            (s: Schedule) => s.time === hour
          ) as Schedule;
          onNext(courtId, [schedule], schedule.appointment);
          return;
        }
        if (isSelected) {
          setSelectedSchedules((prevState) =>
            prevState.filter((s) => s.time !== hour)
          );
          return;
        }

        if (selectedSchedules.find((s) => s.courtId !== courtId)) {
          setSelectedSchedules([]);
        }
        setSelectedSchedules((prevState) => [
          ...prevState,
          {
            date: getUTCString(selectedDate) as string,
            time: hour,
            courtId: courtId,
          } as Schedule,
        ]);
      }}
    >
      {hour.substring(0, 5)}
    </Button>
  );
};

export default BackgroundViewByList;

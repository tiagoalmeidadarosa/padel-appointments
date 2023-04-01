import React, { useEffect, useState } from "react";
import { Drawer } from "antd";
import { AppointmentService } from "@/services/appointment";
import { Appointment } from "@/services/appointment/interfaces";
import { getUTCString } from "@/utils/date";
import { AxiosResponse } from "axios";
import { ModalSteps } from "./shared";
import CustomTitle from "./customTitle";
import CustomFooter from "./customFooter";
import ModalContent from "./content";

type Props = {
  show: boolean;
  courtId: number;
  onCancel: () => void;
};
export default function AppointmentModal(props: Props) {
  const { onCancel, courtId, show } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [confirmLoading, setConfirmLoading] = useState<boolean>(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentStep, setCurrentStep] = useState<ModalSteps>(ModalSteps.step1);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedHour, setSelectedHour] = useState<string>();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment>();

  useEffect(() => {
    if (courtId && selectedDate) {
      setIsLoading(true);
      AppointmentService.getAppointments(
        courtId,
        getUTCString(selectedDate) as string
      )
        .then((response: AxiosResponse<Appointment[]>) => {
          setAppointments(response.data);
        })
        .catch((err) => {
          console.log(err);
          setAppointments([] as Appointment[]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [courtId, selectedDate]);

  const resetModal = () => {
    setSelectedDate(new Date());
    setSelectedHour(undefined);
    setSelectedAppointment(undefined);
    setCurrentStep(ModalSteps.step1);
    onCancel();
  };

  return (
    <Drawer
      open={show}
      placement="right"
      onClose={resetModal}
      closable={false}
      title={CustomTitle({
        courtId,
        currentStep,
        selectedDate,
        selectedHour,
        setSelectedDate,
      })}
      footer={CustomFooter({
        courtId,
        currentStep,
        confirmLoading,
        selectedAppointment,
        selectedDate,
        selectedHour,
        setCurrentStep,
        setConfirmLoading,
        resetModal,
        onCancel,
      })}
    >
      {ModalContent({
        appointments,
        isLoading,
        currentStep,
        selectedAppointment,
        selectedDate,
        setCurrentStep,
        setSelectedHour,
        setSelectedAppointment,
      })}
    </Drawer>
  );
}

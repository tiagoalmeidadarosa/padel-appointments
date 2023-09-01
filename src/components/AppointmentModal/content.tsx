import styles from "./styles.module.css";
import { ModalSteps } from "./shared";
import { Button, Checkbox, Input, InputNumber, Spin, Typography } from "antd";
import { Appointment } from "@/services/appointment/interfaces";
import { getHours } from "@/utils/date";
import { zeroPad } from "@/utils/number";
import { phoneMask } from "@/utils/string";
import { CheckboxChangeEvent } from "antd/es/checkbox";

type Props = {
  appointments: Appointment[];
  isLoading: boolean;
  currentStep: ModalSteps;
  selectedAppointment: Appointment | undefined;
  setCurrentStep: React.Dispatch<React.SetStateAction<ModalSteps>>;
  setSelectedHour: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedAppointment: React.Dispatch<
    React.SetStateAction<Appointment | undefined>
  >;
};
const Content = ({
  appointments,
  isLoading,
  currentStep,
  selectedAppointment,
  setCurrentStep,
  setSelectedHour,
  setSelectedAppointment,
}: Props) => {
  const { Text } = Typography;

  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let value = (e.target as HTMLInputElement).value;
    setSelectedAppointment(
      (prevAppointment) =>
        ({
          ...prevAppointment,
          customerPhoneNumber: phoneMask(value),
        } as Appointment)
    );
  };

  return (
    <div className={styles.content}>
      {isLoading && <Spin />}
      {!isLoading && (
        <>
          {currentStep === ModalSteps.step1 && (
            <>
              {getHours(8, 23).map((hour: string, index: number) => {
                let appointment = appointments.find(
                  (a: Appointment) => a.time === hour
                );
                return (
                  <Button
                    key={`hour_${index}`}
                    type="primary"
                    className={!!appointment ? styles.grayButton : ""}
                    onClick={() => {
                      setSelectedHour(hour);
                      setSelectedAppointment(appointment);
                      setCurrentStep(ModalSteps.step2);
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
                  placeholder="Digite o nome"
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
              </div>
              <div className={styles.input}>
                <Text strong>{"Telefone (obrigatório):"}</Text>
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
              </div>
              <div className={styles.input}>
                <Text strong>{"Preço (obrigatório):"}</Text>
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
              </div>
              <div className={styles.input}>
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
                  disabled={!!selectedAppointment?.id}
                >
                  <Text strong>{"Recorrência"}</Text>
                </Checkbox>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Content;

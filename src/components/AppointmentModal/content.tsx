import styles from "./styles.module.css";
import { ModalSteps } from "./shared";
import {
  Button,
  Input,
  InputNumber,
  Radio,
  RadioChangeEvent,
  Spin,
  Switch,
  Typography,
} from "antd";
import { Appointment, RecurrenceType } from "@/services/appointment/interfaces";
import { getHours } from "@/utils/date";
import { UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { zeroPad } from "@/utils/number";
import { phoneMask } from "@/utils/string";

type Props = {
  appointments: Appointment[];
  isLoading: boolean;
  currentStep: ModalSteps;
  selectedAppointment: Appointment | undefined;
  selectedDate: Date;
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
  selectedDate,
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
              {getHours(selectedDate, 8, 23).map(
                (hour: number, index: number) => {
                  var formattedHour = `${zeroPad(hour)}:00:00`;
                  var appointment = appointments.find(
                    (a: Appointment) => a.time === formattedHour
                  );
                  return (
                    <Button
                      key={`hour_${index}`}
                      type="primary"
                      className={!!appointment ? styles.grayButton : ""}
                      onClick={() => {
                        setSelectedHour(formattedHour);
                        setSelectedAppointment(appointment);
                        setCurrentStep(ModalSteps.step2);
                      }}
                    >
                      {formattedHour.substring(0, 5)}
                    </Button>
                  );
                }
              )}
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
                <div className={`${styles.space} ${styles.centralizedItems}`}>
                  <Text strong>{"Recorrência:"}</Text>
                  <Switch
                    size="small"
                    checked={!!selectedAppointment?.recurrenceType}
                    onChange={(checked: boolean) => {
                      setSelectedAppointment(
                        (prevAppointment) =>
                          ({
                            ...prevAppointment,
                            recurrenceType: checked
                              ? RecurrenceType.NextWeek
                              : undefined,
                          } as Appointment)
                      );
                    }}
                    disabled={!!selectedAppointment?.id}
                  />
                </div>
                {selectedAppointment?.recurrenceType && (
                  <Radio.Group
                    value={selectedAppointment?.recurrenceType}
                    disabled={!!selectedAppointment?.id}
                    onChange={(e: RadioChangeEvent) => {
                      setSelectedAppointment(
                        (prevAppointment) =>
                          ({
                            ...prevAppointment,
                            recurrenceType: e.target.value,
                          } as Appointment)
                      );
                    }}
                  >
                    <Radio value={RecurrenceType.NextWeek}>
                      Próxima semana
                    </Radio>
                    <Radio value={RecurrenceType.NextMonth}>Próximo mês</Radio>
                  </Radio.Group>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Content;

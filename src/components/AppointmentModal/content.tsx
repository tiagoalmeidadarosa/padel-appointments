import styles from "./styles.module.css";
import { ModalSteps } from "./shared";
import {
  Button,
  Input,
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
  selectedCustomerName: string | undefined;
  selectedCustomerPhoneNumber: string | undefined;
  selectedDate: Date;
  selectedRecurrenceType: RecurrenceType | undefined;
  setCurrentStep: React.Dispatch<React.SetStateAction<ModalSteps>>;
  setSelectedHour: React.Dispatch<React.SetStateAction<string | undefined>>;
  setSelectedAppointment: React.Dispatch<
    React.SetStateAction<Appointment | undefined>
  >;
  setSelectedCustomerName: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setSelectedCustomerPhoneNumber: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setSelectedRecurrenceType: React.Dispatch<
    React.SetStateAction<RecurrenceType | undefined>
  >;
};
const Content = ({
  appointments,
  isLoading,
  currentStep,
  selectedAppointment,
  selectedCustomerName,
  selectedCustomerPhoneNumber,
  selectedDate,
  selectedRecurrenceType,
  setCurrentStep,
  setSelectedHour,
  setSelectedAppointment,
  setSelectedCustomerName,
  setSelectedCustomerPhoneNumber,
  setSelectedRecurrenceType,
}: Props) => {
  const { Text } = Typography;

  const handlePhoneKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    let value = (e.target as HTMLInputElement).value;
    setSelectedCustomerPhoneNumber(phoneMask(value));
  };

  return (
    <div className={styles.content}>
      {isLoading && <Spin />}
      {!isLoading && (
        <>
          {currentStep === ModalSteps.step1 && (
            <>
              {getHours(selectedDate).map((h: number, index: number) => {
                var formattedHour = `${zeroPad(h)}:00:00`;
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
                      setSelectedCustomerName(appointment?.customerName);
                      setSelectedCustomerPhoneNumber(
                        appointment?.customerPhoneNumber
                      );
                      setSelectedRecurrenceType(appointment?.recurrenceType);
                      setCurrentStep(ModalSteps.step2);
                    }}
                  >
                    {formattedHour.substring(0, 5)}
                  </Button>
                );
              })}
            </>
          )}
          {currentStep === ModalSteps.step2 && (
            <div className={styles.inputs}>
              <div className={styles.input}>
                <Text>{"Nome:"}</Text>
                <Input
                  placeholder="Digite o nome"
                  prefix={<UserOutlined />}
                  value={selectedCustomerName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedCustomerName(e.target.value)
                  }
                />
              </div>
              <div className={styles.input}>
                <Text>{"Telefone:"}</Text>
                <Input
                  type="tel"
                  maxLength={15}
                  placeholder="Digite o telefone"
                  prefix={<PhoneOutlined />}
                  value={selectedCustomerPhoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setSelectedCustomerPhoneNumber(e.target.value)
                  }
                  onKeyUp={handlePhoneKeyPress}
                />
              </div>
              <div className={styles.input}>
                <div className={`${styles.space} ${styles.centralizedItems}`}>
                  <Text>{"Recorrência:"}</Text>
                  <Switch
                    size="small"
                    checked={!!selectedRecurrenceType}
                    onChange={(checked: boolean) => {
                      if (checked) {
                        setSelectedRecurrenceType(RecurrenceType.NextWeek);
                      } else {
                        setSelectedRecurrenceType(undefined);
                      }
                    }}
                    disabled={!!selectedAppointment?.id}
                  />
                </div>
                {!!selectedRecurrenceType && (
                  <Radio.Group
                    value={selectedRecurrenceType}
                    disabled={!!selectedAppointment?.id}
                    onChange={(e: RadioChangeEvent) =>
                      setSelectedRecurrenceType(e.target.value)
                    }
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

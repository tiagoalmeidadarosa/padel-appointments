import styles from "./styles.module.css";
import {
  Appointment,
  CourtAppointment,
} from "@/services/appointment/interfaces";
import { Button, Spin, Typography } from "antd";
import { useEffect, useState } from "react";
import { ImagePoint } from "./interfaces";
import { getHours, getUTCString } from "@/utils/date";
import { zeroPad } from "@/utils/number";
import { ModalSteps } from "../AppointmentModal/shared";
import { AppointmentService } from "@/services/appointment";
import { AxiosResponse } from "axios";

type Props = {
  imagePoints: ImagePoint[];
  onSelect: (courtId: number, step?: ModalSteps, hour?: string) => void;
};
const FreeCourts = ({ imagePoints, onSelect }: Props) => {
  const { Text } = Typography;

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [courtsAppointments, setCourtsAppointments] = useState<
    CourtAppointment[]
  >([]);

  useEffect(() => {
    setIsLoading(true);
    AppointmentService.getCourtsAppointments(getUTCString(new Date()) as string)
      .then((response: AxiosResponse<CourtAppointment[]>) => {
        setCourtsAppointments(response.data);
      })
      .catch((err) => {
        console.log(err);
        setCourtsAppointments([] as CourtAppointment[]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <div className={styles.absolute}>
      <div className={styles.title}>
        <Text>{"Horários disponíveis para marcação hoje:"}</Text>
      </div>
      {isLoading && (
        <div className={styles.center}>
          <Spin />
        </div>
      )}
      {!isLoading && (
        <div className={styles.body}>
          {imagePoints.map((imagePoint: ImagePoint) => {
            return (
              <div key={`court_${imagePoint.id}`}>
                <Text>{imagePoint.title}</Text>
                <div className={styles.buttons}>
                  <>
                    {getHours(new Date(), 18, 22).map(
                      (hour: number, index: number) => {
                        var courtId = parseInt(imagePoint.id);
                        var appointments = courtsAppointments?.find(
                          (ca: CourtAppointment) => ca.id === courtId
                        )?.appointments;

                        var formattedHour = `${zeroPad(hour)}:00:00`;
                        var appointment = appointments?.find(
                          (a: Appointment) => a.time === formattedHour
                        );
                        if (appointment) {
                          return;
                        }
                        return (
                          <Button
                            key={`hour_${index}`}
                            type="primary"
                            onClick={() =>
                              onSelect(courtId, ModalSteps.step2, formattedHour)
                            }
                          >
                            {formattedHour.substring(0, 5)}
                          </Button>
                        );
                      }
                    )}
                  </>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FreeCourts;

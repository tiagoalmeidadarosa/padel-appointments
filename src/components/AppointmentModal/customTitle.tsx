import styles from "./styles.module.css";
import { ModalSteps } from "./shared";
import { Button, Typography } from "antd";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { addDays } from "@/utils/date";
import moment from "moment";
import "moment/locale/pt-br";

type Props = {
  courtId: number;
  currentStep: ModalSteps;
  selectedDate: Date;
  selectedHour: string | undefined;
  setSelectedDate: React.Dispatch<React.SetStateAction<Date>>;
};
const CustomTitle = ({
  courtId,
  currentStep,
  selectedDate,
  selectedHour,
  setSelectedDate,
}: Props) => {
  const { Text } = Typography;

  moment.locale("pt-br");

  return (
    <>
      {currentStep === ModalSteps.step1 && (
        <div className={`${styles.space} ${styles.centralizedItems}`}>
          <Button
            type="text"
            icon={<LeftOutlined />}
            onClick={() => setSelectedDate((prev) => addDays(prev, -1))}
            disabled={new Date().getDate() === selectedDate.getDate()}
          />
          <Text>{`Quadra ${courtId} - ${
            moment(selectedDate).format("llll").split(" às")[0]
          }`}</Text>
          <Button
            type="text"
            icon={<RightOutlined />}
            onClick={() => setSelectedDate((prev) => addDays(prev, 1))}
          />
        </div>
      )}
      {currentStep === ModalSteps.step2 && (
        <div className={styles.center}>
          <Text>{`Quadra ${courtId} - ${
            moment(selectedDate).format("llll").split(" às")[0]
          } ${selectedHour?.substring(
            0,
            selectedHour?.lastIndexOf(":")
          )}`}</Text>
        </div>
      )}
    </>
  );
};

export default CustomTitle;

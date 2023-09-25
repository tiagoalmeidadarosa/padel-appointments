import { useBackgroundImageDimensions } from "@/hooks/useBackgroundImageDimensions";
import { useBackgroundImagePoints } from "@/hooks/useBackgroundImagePoints";
import { useScreenSize } from "@/hooks/useScreenSize";
import React, { useState } from "react";
import ImageMapper from "react-img-mapper";
import styles from "./styles.module.css";
import { ImagePoint } from "./interfaces";
import { BackgroundType } from "../../shared";
import { Button, Space, Switch, Typography } from "antd";
import { signOut } from "next-auth/react";
import { LogoutOutlined } from "@ant-design/icons";
import AppointmentModal from "../AppointmentDrawer";

type Props = {
  backgroundType: BackgroundType;
  onChangeBackgroundType: (backgroundType: BackgroundType) => void;
};
const BackgroundViewPerImage = (props: Props) => {
  const { Text } = Typography;
  const { backgroundType, onChangeBackgroundType } = props;
  const { isBig, isMedium, isSmall } = useScreenSize();
  const { width, height } = useBackgroundImageDimensions(
    isBig,
    isMedium,
    isSmall
  );
  const { coords } = useBackgroundImagePoints(isBig, isMedium, isSmall);

  const imagePoints = [
    {
      id: "1",
      title: "Quadra 1",
      shape: "rect",
      name: "CourtOne",
      strokeColor: "black",
      coords: coords[0],
    },
    {
      id: "2",
      title: "Quadra 2",
      shape: "rect",
      name: "CourtTwo",
      strokeColor: "black",
      coords: coords[1],
    },
    {
      id: "3",
      title: "Quadra 3",
      shape: "rect",
      name: "CourtThree",
      strokeColor: "black",
      coords: coords[2],
    },
  ] as ImagePoint[];

  const [openModal, setOpenModal] = useState(false);
  const [selectedCourtId, setSelectedCourtId] = useState<number>();

  const handleNext = (courtId: number) => {
    setSelectedCourtId(courtId);
    setOpenModal(true);
  };

  return (
    <>
      <div className={styles.flex}>
        <div>
          <ImageMapper
            src={"/padel-courts-background.svg"}
            map={{
              name: "my-map",
              areas: imagePoints,
            }}
            lineWidth={1}
            width={width}
            height={height}
            onClick={(area: any) => handleNext(area.id)}
          />
        </div>
      </div>
      <div className={styles.rightAbsolute}>
        <Button icon={<LogoutOutlined />} type="text" onClick={() => signOut()}>
          Logout
        </Button>
      </div>
      <div className={styles.bottomAbsolute}>
        <Space>
          <Text>Visualização por lista</Text>
          <Switch
            size="small"
            checked={backgroundType === BackgroundType.list}
            onChange={() => onChangeBackgroundType(BackgroundType.list)}
          />
        </Space>
      </div>
      {openModal && selectedCourtId && (
        <AppointmentModal
          show={openModal}
          courtId={selectedCourtId}
          onCancel={() => {
            setSelectedCourtId(undefined);
            setOpenModal(false);
          }}
        />
      )}
    </>
  );
};

export default BackgroundViewPerImage;

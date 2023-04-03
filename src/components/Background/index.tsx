import { useBackgroundImageDimensions } from "@/hooks/useBackgroundImageDimensions";
import { useBackgroundImagePoints } from "@/hooks/useBackgroundImagePoints";
import { useScreenSize } from "@/hooks/useScreenSize";
import React from "react";
import ImageMapper from "react-img-mapper";
import styles from "./styles.module.css";
import { ImagePoint } from "./interfaces";
import { ModalSteps } from "../AppointmentModal/shared";
import FreeCourts from "./freeCourts";

type Props = {
  onClick: (courtId: number, step?: ModalSteps, hour?: string) => void;
};
const Background = (props: Props) => {
  const { onClick } = props;
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
            onClick={(area: any) => onClick(area.id)}
          />
        </div>
      </div>
      <FreeCourts imagePoints={imagePoints} onSelect={onClick} />
    </>
  );
};

export default Background;

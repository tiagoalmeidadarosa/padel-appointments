import { useBackgroundImageDimensions } from "@/hooks/useBackgroundImageDimensions";
import { useBackgroundImagePoints } from "@/hooks/useBackgroundImagePoints";
import { useScreenSize } from "@/hooks/useScreenSize";
import React from "react";
import ImageMapper from "react-img-mapper";
import styles from "./styles.module.css";

type Props = {
  onClick: (courtId: number) => void;
};
const BackgroundImage = (props: Props) => {
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
      title: "Court 1",
      shape: "rect",
      name: "CourtOne",
      strokeColor: "black",
      coords: coords[0],
    },
    {
      id: "2",
      title: "Court 2",
      shape: "rect",
      name: "CourtTwo",
      strokeColor: "black",
      coords: coords[1],
    },
    {
      id: "3",
      title: "Court 3",
      shape: "rect",
      name: "CourtThree",
      strokeColor: "black",
      coords: coords[2],
    },
  ];

  return (
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
  );
};

export default BackgroundImage;

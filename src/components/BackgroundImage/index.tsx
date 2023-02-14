import { useDimensions } from "@/hooks/useDimensions";
import { useScreenSize } from "@/hooks/useScreenSize";
import React from "react";
import ImageMapper from "react-img-mapper";

type Props = {
  onClick: (courtId: number) => void;
};
const BackgroundImage = (props: Props) => {
  const { onClick } = props;
  const { isBig, isMedium, isSmall } = useScreenSize();
  const { width, height } = useDimensions(isBig, isMedium, isSmall);
  //Todo: create only one hook called useCoords

  // const getCoords = () => {
  //   if (isBig) {
  //     return [];
  //   } else if (isMedium) {
  //     return [];
  //   } else {
  //     return [
  //       width / 2 - 115,
  //       48,
  //       width / 2 - 115,
  //       199,
  //       width / 2 + 129,
  //       199,
  //       width / 2 + 129,
  //       48,
  //     ];
  //   }
  // };

  const imagePoints = [
    {
      id: "1",
      title: "Court 1",
      shape: "poly",
      name: "CourtOne",
      strokeColor: "black",
      coords: [
        width / 2 - 115,
        48,
        width / 2 - 115,
        199,
        width / 2 + 129,
        199,
        width / 2 + 129,
        48,
      ],
    },
    {
      id: "2",
      title: "Court 2",
      shape: "poly",
      name: "CourtTwo",
      strokeColor: "black",
      coords: [
        width / 2 - 190,
        height - 43,
        width / 2 - 190,
        height / 2 + 13,
        width / 2 - 41,
        height / 2 + 13,
        width / 2 - 41,
        height - 43,
      ],
    },
    {
      id: "3",
      title: "Court 3",
      shape: "poly",
      name: "CourtThree",
      strokeColor: "black",
      coords: [
        width / 2 + 205,
        height - 43,
        width / 2 + 205,
        height / 2 + 13,
        width / 2 + 55,
        height / 2 + 13,
        width / 2 + 55,
        height - 43,
      ],
    },
  ];

  return (
    <ImageMapper
      src={"/padel-courts-image.svg"}
      map={{
        name: "my-map",
        areas: imagePoints,
      }}
      lineWidth={1}
      width={width}
      height={height}
      onClick={(area: any) => onClick(area.id)}
    />
  );
};

export default BackgroundImage;

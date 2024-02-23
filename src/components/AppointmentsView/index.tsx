"use client";
import { useState } from "react";
import { BackgroundType } from "@/shared";
import BackgroundViewByList from "../BackgroundViewByList";
import BackgroundViewPerImage from "../BackgroundViewPerImage";

export default function AppointmentsView() {
  var backgroundView = BackgroundType.image.toString();
  if (typeof window !== "undefined") {
    backgroundView = localStorage.getItem("backgroundView") || backgroundView;
  }

  const [backgroundType, setBackgroundType] = useState<BackgroundType>(
    backgroundView === BackgroundType.image.toString()
      ? BackgroundType.image
      : BackgroundType.list
  );

  const handleChangeBackgroundType = (backgroundType: BackgroundType) => {
    localStorage.setItem("backgroundView", backgroundType.toString());
    setBackgroundType(backgroundType);
  };

  return (
    <>
      {backgroundType === BackgroundType.image && (
        <BackgroundViewPerImage
          backgroundType={backgroundType}
          onChangeBackgroundType={handleChangeBackgroundType}
        />
      )}
      {backgroundType === BackgroundType.list && (
        <BackgroundViewByList
          backgroundType={backgroundType}
          onChangeBackgroundType={handleChangeBackgroundType}
        />
      )}
    </>
  );
}

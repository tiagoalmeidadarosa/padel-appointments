"use client";
import { useState } from "react";
import dynamic from "next/dynamic";
import { BackgroundType } from "@/shared";

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

  const BackgroundViewPerImage = dynamic(
    () => import("@/components/BackgroundViewPerImage"),
    {
      ssr: false,
    }
  );

  const BackgroundViewByList = dynamic(
    () => import("@/components/BackgroundViewByList"),
    {
      ssr: false,
    }
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

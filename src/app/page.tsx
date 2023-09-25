"use client";
import { Rubik } from "@next/font/google";
import styles from "./page.module.css";
import { useState } from "react";
import { ConfigProvider } from "antd";
import dynamic from "next/dynamic";
import { BackgroundType } from "@/shared";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Home() {
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
    <ConfigProvider
      theme={{
        token: {
          fontFamily: rubik.style.fontFamily,
        },
      }}
    >
      <main className={styles.main}>
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
      </main>
    </ConfigProvider>
  );
}

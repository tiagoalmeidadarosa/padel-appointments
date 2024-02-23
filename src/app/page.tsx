"use client";
import { Rubik } from "@next/font/google";
import styles from "./page.module.css";
import { ConfigProvider } from "antd";
import dynamic from "next/dynamic";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

const SideMenu = dynamic(
  () => import("@/components/SideMenu"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: rubik.style.fontFamily,
        },
      }}
    >
      <main className={styles.main}>
        <SideMenu />
      </main>
    </ConfigProvider>
  );
}

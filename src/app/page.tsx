"use client";
import { Rubik } from "@next/font/google";
import styles from "./page.module.css";
import { ConfigProvider } from "antd";
import SideMenu from "@/components/SideMenu";

const rubik = Rubik({
  subsets: ["latin"],
  weight: ["400"],
});

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

"use client";
import Image from "next/image";
import styles from "./styles.module.css";
import { useState } from "react";
import { Layout, Menu, MenuProps } from "antd";
import { ScheduleOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import AppointmentsView from "../AppointmentsView";
import ProductsView from "../ProductsView";

export default function SideMenu() {
  const { Content, Sider } = Layout;
  type MenuItem = Required<MenuProps>["items"][number];

  const [collapsed, setCollapsed] = useState(true);
  const [selectedKey, setSelectedKey] = useState<string>("1");

  const getItem = (
    label: React.ReactNode,
    key: React.Key,
    icon?: React.ReactNode,
    children?: MenuItem[]
  ): MenuItem => {
    return {
      key,
      icon,
      children,
      label,
    } as MenuItem;
  };

  const items: MenuItem[] = [
    getItem("Agendamentos", "1", <ScheduleOutlined />),
    getItem("Produtos", "2", <AppstoreAddOutlined />),
  ];

  const handleMenuClick = ({ key }: any) => {
    setSelectedKey(key);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className={styles.logo}>
          {collapsed && (
            <Image
              src="/logo.svg"
              width={20}
              height={40}
              alt="Small padel appointments logo"
            />
          )}
          {!collapsed && (
            <Image
              src="/login-logo.svg"
              width={150}
              height={40}
              alt="Full padel appointments logo"
            />
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={items}
          defaultSelectedKeys={["1"]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Content style={{ margin: "0 16px" }}>
          {selectedKey === "1" && <AppointmentsView />}
          {selectedKey === "2" && <ProductsView />}
        </Content>
      </Layout>
    </Layout>
  );
}

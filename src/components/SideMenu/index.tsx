"use client";
import Image from "next/image";
import styles from "./styles.module.css";
import { useState } from "react";
import { Button, Layout, Menu, MenuProps, Typography } from "antd";
import {
  ScheduleOutlined,
  AppstoreAddOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { signOut } from "next-auth/react";
import AppointmentsView from "../AppointmentsView";
import ProductsView from "../ProductsView";
import React from "react";

export default function SideMenu() {
  const { Header, Content, Sider } = Layout;
  const { Title } = Typography;

  type MenuItem = Required<MenuProps>["items"][number] & {
    label: string;
    content: React.ReactNode;
  };

  const menuItems: MenuItem[] = [
    {
      key: "1",
      icon: React.createElement(ScheduleOutlined),
      label: "Agendamentos",
      content: React.createElement(AppointmentsView),
    },
    {
      key: "2",
      icon: React.createElement(AppstoreAddOutlined),
      label: "Produtos",
      content: React.createElement(ProductsView),
    },
  ];

  const [collapsed, setCollapsed] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem>(
    menuItems[0]
  );

  const handleMenuClick = ({ key }: any) => {
    setSelectedMenuItem(
      menuItems.find((item) => item.key === key) || menuItems[0]
    );
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
          items={menuItems}
          defaultSelectedKeys={["1"]}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout>
        <Header className={styles.header}>
          <Title level={5}>
            {selectedMenuItem.label}
          </Title>
          <Button
            icon={<LogoutOutlined />}
            onClick={() => signOut()}
          />
        </Header>
        <Content style={{ margin: "0 16px" }}>
          {selectedMenuItem.content}
        </Content>
      </Layout>
    </Layout>
  );
}

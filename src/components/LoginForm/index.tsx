"use client";
import styles from "./styles.module.css";
import Image from "next/image";
import { Button, Form, Input } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { signIn } from "next-auth/react";
import { useState } from "react";

type Props = {
  error: string | null;
};
export default function LoginForm({ error }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const errorMessage = error?.includes("401")
    ? "Usuário ou senha incorretos"
    : error;

  const onFinish = async (values: any) => {
    setIsLoading(true);
    const { username, password } = values;

    await signIn("credentials", {
      username: username,
      password: password,
      redirect: true,
      callbackUrl: "/",
    });

    setIsLoading(false);
  };

  return (
    <div className={styles.initial}>
      <div className={styles.center}>
        <Form
          name="normal_login"
          className={styles.loginForm}
          initialValues={{ remember: true }}
          onFinish={onFinish}
        >
          <Form.Item>
            <Image
              src="/login-logo.svg"
              width={200}
              height={40}
              alt="Picture of the author"
            />
          </Form.Item>
          <Form.Item
            name="username"
            rules={[
              {
                required: true,
                message: "Por favor insira seu nome de usuário",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Username"
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Por favor insira sua senha" }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={styles.loginFormButton}
              loading={isLoading}
            >
              Log in
            </Button>
          </Form.Item>
          {errorMessage && <div className={styles.error}>{errorMessage}</div>}
        </Form>
      </div>
    </div>
  );
}

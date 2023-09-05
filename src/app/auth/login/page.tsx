"use client";
import dynamic from "next/dynamic";

export default function Login() {
  const LoginForm = dynamic(() => import("@/components/LoginForm"), {
    ssr: false,
  });

  return <LoginForm />;
}

"use client";
import dynamic from "next/dynamic";
import { useSearchParams } from 'next/navigation'

export default function Login(props: any) {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const LoginForm = dynamic(() => import("@/components/LoginForm"), {
    ssr: false,
  });

  return <LoginForm error={error} />;
}

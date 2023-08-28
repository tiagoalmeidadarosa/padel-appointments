"use client";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

interface IProps {
  children: ReactNode;
  session: any;
}

export default function RootLayout(props: IProps) {
  const { children, session } = props;

  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head />
      <body>
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}

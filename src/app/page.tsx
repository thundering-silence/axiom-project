"use client";

import Main from "@/components/Main";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
      />
      <Main />
      <Toaster position="bottom-right" />
    </>
  );
}

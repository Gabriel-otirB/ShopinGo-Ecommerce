"use client";

import { Suspense } from "react";
import Login from "./components/login-component";

export default function LoginPage() {
  return (
    <Suspense>
      <Login />
    </Suspense>
  );
}

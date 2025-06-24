"use client";

import { useAuth } from "@/contexts/AuthContext";
import { LoginForm } from "@/components/auth/LoginForm";
import { Dashboard } from "@/components/Dashboard";

export default function HomePage() {
  const { user } = useAuth();

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard />;
}

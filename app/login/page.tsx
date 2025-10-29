"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LoginForm from "@/components/auth/login-form";
import { authService } from "@/services/auth";
import { useAuthStore, useHydrateAuthFromStorage } from "@/hooks/useAuthStore";

export default function LoginPage() {
  useHydrateAuthFromStorage();
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async ({ email, password }: { email: string; password: string }) => {
    try {
      setError(null);
      setLoading(true);
      const res = await authService.login(email, password);
      setToken(res.access_token);
      router.push("/dashboard");
    } catch (e) {
      const errorMessage = (e as { response?: { data?: { message?: string } } })?.response?.data?.message || "Login failed";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] grid place-items-center p-4">
      <LoginForm onSubmit={handleSubmit} loading={loading} error={error} />
    </div>
  );
}


"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { createClient } from "@/lib/supabase/client";
import AuthCard from "./AuthCard";

export default function LoginForm() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <AuthCard
      title="Welcome Back"
      description="Sign in to continue using HireTrack Pro"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>

          <Input
  id="email"
  type="email"
  placeholder="john@example.com"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="h-14 rounded-xl border-slate-700 bg-slate-950 px-4 text-base transition-all focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
/>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>

          <Input
  id="password"
  type="password"
  placeholder="••••••••"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  className="h-14 rounded-xl border-slate-700 bg-slate-950 px-4 text-base transition-all focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-blue-500/20"
  required
/>
        </div>

        {error && (
          <p className="text-sm text-red-500">
            {error}
          </p>
        )}

        <div className="flex items-center space-x-2">
  <Checkbox id="remember" />

  <Label
    htmlFor="remember"
    className="cursor-pointer text-slate-400"
  >
    Remember me
  </Label>
</div>

        <Button
  type="submit"
  disabled={loading}
  className="w-full h-12 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
>
  {loading ? "Signing In..." : "Sign In"}
</Button>

        <p className="text-center text-sm text-slate-400">
          Don't have an account?{" "}
          <Link
            href="/register"
            className="font-medium text-blue-400 hover:text-blue-300"
          >
            Create one
          </Link>
        </p>
      </form>
    </AuthCard>
  );
}
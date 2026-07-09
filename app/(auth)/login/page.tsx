import LoginForm from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb20,transparent_60%)]" />

      <div className="relative z-10 w-full">
        <LoginForm />
      </div>
    </main>
  );
}
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <h1 className="text-3xl font-bold">
          Forgot Password
        </h1>

        <p className="mt-3 text-slate-400">
          Password recovery is currently unavailable.
          Please return to the login page.
        </p>

        <Link
          href="/login"
          className="mt-8 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-medium text-white transition hover:bg-blue-700"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
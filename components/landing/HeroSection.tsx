import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <div className="mx-auto max-w-6xl text-center">
        <div className="inline-flex rounded-full border border-slate-700 bg-slate-900 px-5 py-2 text-sm">
          Smart Hiring Platform
        </div>

        <h1 className="mt-10 text-5xl font-bold leading-tight md:text-7xl">
          Hire Smarter.
          <br />
          Manage Candidates{" "}
          <span className="text-blue-500">
            Effortlessly.
          </span>
        </h1>

        <p className="mx-auto mt-8 max-w-3xl text-lg text-slate-400 md:text-xl">
          HireTrack Pro helps recruiters manage applicants,
          schedule interviews, and streamline hiring — all in
          one modern platform.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-3 rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </Link>

          <Link
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3 font-medium text-white transition hover:bg-slate-800"
          >
            Live Demo
          </Link>
        </div>
      </div>
    </main>
  );
}
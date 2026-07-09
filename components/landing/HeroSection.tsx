import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-6">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#2563eb20,transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <span className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-300">
          Smart Hiring Platform
        </span>

        <h1 className="mt-8 text-5xl font-bold tracking-tight leading-tight lg:text-6xl xl:text-7xl">
          Hire Smarter.
          <br />
          Manage Candidates
          <span className="text-blue-500"> Effortlessly.</span>
        </h1>

        <p className="mx-auto mt-8 max-w-2xl text-lg text-slate-400">
          HireTrack Pro helps recruiters manage applicants, schedule interviews,
          and streamline hiring — all in one modern platform.
        </p>

        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg">
            Get Started
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <Button 
          size="lg" 
          variant="outline"
          className="border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 hover:text-white"
        >
         Live Demo
        </Button>
        </div>
      </div>
    </section>
  );
}
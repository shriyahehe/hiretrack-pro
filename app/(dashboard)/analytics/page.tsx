import {
  Briefcase,
  CalendarDays,
  CheckCircle2,
  Users,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [
    candidatesResult,
    jobsResult,
    interviewsResult,
    hiredResult,
  ] = await Promise.all([
    supabase
      .from("Candidate")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("Job")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("Interview")
      .select("id", { count: "exact", head: true }),

    supabase
      .from("Candidate")
      .select("id", { count: "exact", head: true })
      .eq("status", "HIRED"),
  ]);

  const totalCandidates = candidatesResult.count ?? 0;
  const totalJobs = jobsResult.count ?? 0;
  const totalInterviews = interviewsResult.count ?? 0;
  const totalHired = hiredResult.count ?? 0;

  const stats = [
    {
      title: "Total Candidates",
      value: totalCandidates,
      icon: Users,
    },
    {
      title: "Total Jobs",
      value: totalJobs,
      icon: Briefcase,
    },
    {
      title: "Total Interviews",
      value: totalInterviews,
      icon: CalendarDays,
    },
    {
      title: "Candidates Hired",
      value: totalHired,
      icon: CheckCircle2,
    },
  ];

  const hiringRate =
    totalCandidates > 0
      ? Math.round((totalHired / totalCandidates) * 100)
      : 0;

  const interviewRate =
    totalCandidates > 0
      ? Math.round(
          (totalInterviews / totalCandidates) * 100
        )
      : 0;

  return (
    <div className="min-h-full bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">
            Analytics
          </h1>

          <p className="mt-2 text-slate-400">
            Track your hiring performance and recruitment activity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">
                      {stat.title}
                    </p>

                    <p className="mt-3 text-4xl font-bold">
                      {stat.value}
                    </p>
                  </div>

                  <div className="rounded-xl bg-blue-600/20 p-3">
                    <Icon className="h-6 w-6 text-blue-400" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Hiring Rate
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Percentage of candidates successfully hired.
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Hiring progress
                </span>

                <span className="font-semibold text-blue-400">
                  {hiringRate}%
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(hiringRate, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-xl font-semibold">
              Interview Activity
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Interview activity compared with total candidates.
            </p>

            <div className="mt-8">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">
                  Interview rate
                </span>

                <span className="font-semibold text-blue-400">
                  {interviewRate}%
                </span>
              </div>

              <div className="mt-3 h-3 overflow-hidden rounded-full bg-slate-800">
                <div
                  className="h-full rounded-full bg-blue-600 transition-all"
                  style={{
                    width: `${Math.min(interviewRate, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">
            Recruitment Summary
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Candidates per Job
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalJobs > 0
                  ? (totalCandidates / totalJobs).toFixed(1)
                  : "0"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Interviews per Candidate
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalCandidates > 0
                  ? (
                      totalInterviews / totalCandidates
                    ).toFixed(1)
                  : "0"}
              </p>
            </div>

            <div className="rounded-xl bg-slate-950 p-5">
              <p className="text-sm text-slate-500">
                Successful Hires
              </p>

              <p className="mt-2 text-2xl font-bold">
                {totalHired}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
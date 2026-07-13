import {
  CalendarDays,
  Clock,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type Interview = {
  id: string;
  scheduledAt: string;
  Candidate: {
    fullName: string;
    position: string;
  } | null;
};

export default async function UpcomingInterviews() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("Interview")
    .select(`
      id,
      scheduledAt,
      Candidate (
        fullName,
        position
      )
    `)
    .gte("scheduledAt", new Date().toISOString())
    .order("scheduledAt", {
      ascending: true,
    })
    .limit(3);

  const interviews =
    (data ?? []) as unknown as Interview[];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-blue-500" />

        <h2 className="text-xl font-semibold text-white">
          Upcoming Interviews
        </h2>
      </div>

      {interviews.length > 0 ? (
        <div className="space-y-5">
          {interviews.map((interview) => (
            <div
              key={interview.id}
              className="rounded-xl border border-slate-800 p-4 transition hover:border-blue-500"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-white">
                    {interview.Candidate?.fullName ??
                      "Unknown Candidate"}
                  </p>

                  <p className="text-sm text-slate-400">
                    {interview.Candidate?.position ??
                      "Position not specified"}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-2 text-blue-400">
                  <Clock className="h-4 w-4" />

                  {new Date(
                    interview.scheduledAt
                  ).toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <p className="mt-3 text-xs text-slate-500">
                {new Date(
                  interview.scheduledAt
                ).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="py-10 text-center text-slate-400">
          No upcoming interviews.
        </p>
      )}
    </div>
  );
}
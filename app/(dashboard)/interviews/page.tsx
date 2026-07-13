import {
  CalendarDays,
  Clock,
  UserRound,
  Video,
} from "lucide-react";

import CreateInterviewDialog from "@/components/interviews/CreateInterviewDialog";
import EditInterviewDialog from "@/components/interviews/EditInterviewDialog";
import DeleteInterviewDialog from "@/components/interviews/DeleteInterviewDialog";
import { createClient } from "@/lib/supabase/server";

type Interview = {
  id: string;
  scheduledAt: string;
  type: string;
  status: string;
  notes: string | null;
  candidateId: string | null;
  Candidate?: {
    id: string;
    fullName: string;
    position: string;
  } | null;
  Job?: {
    id: string;
    title: string;
  } | null;
};

function formatValue(value: string) {
  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default async function InterviewsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Interview")
    .select(`
      id,
      scheduledAt,
      type,
      status,
      notes,
      candidateId,
      Candidate (
        id,
        fullName,
        position
      ),
      Job (
        id,
        title
      )
    `)
    .order("scheduledAt", {
      ascending: true,
    });

  const interviews =
    (data ?? []) as unknown as Interview[];

  return (
    <div className="min-h-full bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Interviews
            </h1>

            <p className="mt-2 text-slate-400">
              Schedule and manage candidate interviews.
            </p>
          </div>

          <CreateInterviewDialog />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-red-400">
            Unable to load interviews: {error.message}
          </div>
        ) : interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((interview) => (
              <div
                key={interview.id}
                className="rounded-xl border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-xl bg-blue-600/20 p-3">
                      <CalendarDays className="h-6 w-6 text-blue-400" />
                    </div>

                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {interview.Candidate?.fullName ??
                          "Unknown Candidate"}
                      </h2>

                      <p className="mt-1 text-slate-400">
                        {interview.Job?.title ??
                          interview.Candidate?.position ??
                          "Position not specified"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                        <span className="flex items-center gap-2">
                          <CalendarDays className="h-4 w-4" />
                          {new Date(
                            interview.scheduledAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>

                        <span className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          {new Date(
                            interview.scheduledAt
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <span className="flex items-center gap-2">
                          {interview.type === "VIDEO" ? (
                            <Video className="h-4 w-4" />
                          ) : (
                            <UserRound className="h-4 w-4" />
                          )}

                          {formatValue(interview.type)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-4">
                    <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                      {formatValue(interview.status)}
                    </span>

                    <div className="flex gap-2">
                      <EditInterviewDialog
  interview={{
    id: interview.id,
    scheduledAt: interview.scheduledAt,
    type: interview.type,
    status: interview.status,
    notes: interview.notes,
  }}
/>

                      <DeleteInterviewDialog
                        interviewId={interview.id}
                        candidateName={
                          interview.Candidate?.fullName ??
                          "Unknown Candidate"
                        }
                      />
                    </div>
                  </div>
                </div>

                {interview.notes && (
                  <p className="mt-5 border-t border-slate-800 pt-5 text-sm text-slate-400">
                    {interview.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 py-20 text-center">
            <CalendarDays className="mx-auto h-10 w-10 text-slate-600" />

            <h2 className="mt-5 text-xl font-semibold text-white">
              No interviews scheduled
            </h2>

            <p className="mt-2 text-slate-400">
              Schedule your first candidate interview.
            </p>

            <div className="mt-6 flex justify-center">
              <CreateInterviewDialog />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
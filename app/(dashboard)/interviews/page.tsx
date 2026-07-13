import CreateInterviewDialog from "@/components/interviews/CreateInterviewDialog";
import DeleteInterviewDialog from "@/components/interviews/DeleteInterviewDialog";
import EditInterviewDialog from "@/components/interviews/EditInterviewDialog";
import { createClient } from "@/lib/supabase/server";

type Interview = {
  id: string;
  scheduledAt: string;
  type: string;
  status: string;
  notes: string | null;
  candidateId: string;

  Candidate: {
    id: string;
    fullName: string;
    position: string;
  };

  Job: {
    id: string;
    title: string;
  } | null;
};

type Candidate = {
  id: string;
  fullName: string;
  position: string;
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

  const [
    { data: interviewData, error: interviewError },
    { data: candidateData },
  ] = await Promise.all([
    supabase
      .from("Interview")
      .select(
        "id, candidateId, scheduledAt, type, status, notes"
      )
      .order("scheduledAt", {
        ascending: true,
      }),

    supabase
      .from("Candidate")
      .select("id, fullName, position"),
  ]);

  const interviews =
    (interviewData ?? []) as Interview[];

  const candidates =
    (candidateData ?? []) as Candidate[];

  const candidateMap = new Map(
    candidates.map((candidate) => [
      candidate.id,
      candidate,
    ])
  );

  return (
    <div className="min-h-full bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">
              Interviews
            </h1>

            <p className="mt-3 text-slate-400">
              Schedule and manage candidate interviews.
            </p>
          </div>

          <CreateInterviewDialog />
        </div>

        {interviewError ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-6 text-red-400">
            Unable to load interviews:{" "}
            {interviewError.message}
          </div>
        ) : interviews.length > 0 ? (
          <div className="space-y-4">
            {interviews.map((interview) => {
              const candidate = candidateMap.get(
                interview.candidateId
              );

              return (
                <div
                  key={interview.id}
                  className="rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-slate-700"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h2 className="text-xl font-semibold text-white">
                        {candidate?.fullName ||
                          "Unknown Candidate"}
                      </h2>

                      <p className="mt-1 text-slate-400">
                        {candidate?.position ||
                          "Position not specified"}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-3">
                        <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
                          {new Date(
                            interview.scheduledAt
                          ).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>

                        <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
                          {new Date(
                            interview.scheduledAt
                          ).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>

                        <span className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-slate-300">
                          {formatValue(interview.type)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
  <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
    {formatValue(interview.status)}
  </span>

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
    candidateName={interview.Candidate.fullName}
  />
</div>
                  </div>

                  {interview.notes && (
                    <p className="mt-5 border-t border-slate-800 pt-5 text-sm text-slate-400">
                      {interview.notes}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h2 className="text-xl font-semibold text-white">
              No interviews scheduled
            </h2>

            <p className="mt-2 text-slate-400">
              Schedule your first candidate interview.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
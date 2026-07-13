import Link from "next/link";
import { Users } from "lucide-react";

import CreateJobDialog from "@/components/jobs/CreateJobDialog";
import DeleteJobDialog from "@/components/jobs/DeleteJobDialog";
import EditJobDialog from "@/components/jobs/EditJobDialog";
import { createClient } from "@/lib/supabase/server";

type Job = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  Candidate: {
    id: string;
  }[];
};

function formatValue(value: string | null) {
  if (!value) {
    return "Not specified";
  }

  return value
    .toLowerCase()
    .split("_")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

export default async function JobsPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Job")
    .select(`
      id,
      title,
      department,
      location,
      employmentType,
      description,
      status,
      createdAt,
      Candidate (
        id
      )
    `)
    .order("createdAt", {
      ascending: false,
    });

  const jobs = (data ?? []) as unknown as Job[];

  return (
    <div className="min-h-full bg-slate-950 p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">
              Jobs
            </h1>

            <p className="mt-2 text-slate-400">
              Create and manage your open job positions.
            </p>
          </div>

          <CreateJobDialog />
        </div>

        {error ? (
          <div className="rounded-xl border border-red-900 bg-red-950/40 p-6">
            <p className="text-red-400">
              Unable to load jobs: {error.message}
            </p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {jobs.map((job) => {
              const candidateCount =
                job.Candidate?.length ?? 0;

              return (
                <div
                  key={job.id}
                  className="flex min-h-72 flex-col rounded-xl border border-slate-800 bg-slate-900 p-6 transition hover:border-blue-500/60"
                >
                  <Link
                    href={`/jobs/${job.id}`}
                    className="block"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h2 className="text-xl font-semibold text-white transition hover:text-blue-400">
                          {job.title}
                        </h2>

                        <p className="mt-2 text-slate-400">
                          {job.department ||
                            "No department"}
                        </p>
                      </div>

                      <span className="shrink-0 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                        {formatValue(job.status)}
                      </span>
                    </div>

                    <div className="mt-5 space-y-2 text-sm text-slate-500">
                      <p>
                        Location:{" "}
                        <span className="text-slate-400">
                          {job.location ||
                            "Not specified"}
                        </span>
                      </p>

                      <p>
                        Job type:{" "}
                        <span className="text-slate-400">
                          {formatValue(
                            job.employmentType
                          )}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5 flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-950 px-4 py-3 transition hover:border-blue-500/50">
                      <Users className="h-5 w-5 text-blue-400" />

                      <p className="text-sm text-slate-400">
                        <span className="font-semibold text-white">
                          {candidateCount}
                        </span>{" "}
                        {candidateCount === 1
                          ? "Candidate"
                          : "Candidates"}
                      </p>
                    </div>

                    {job.description ? (
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-400">
                        {job.description}
                      </p>
                    ) : (
                      <p className="mt-5 text-sm text-slate-600">
                        No description added.
                      </p>
                    )}
                  </Link>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-800 pt-5">
                    <p className="text-xs text-slate-500">
                      Created{" "}
                      {new Date(
                        job.createdAt
                      ).toLocaleDateString("en-IN")}
                    </p>

                    <div className="flex items-center gap-2">
                      <EditJobDialog
                        job={{
                          id: job.id,
                          title: job.title,
                          department: job.department,
                          location: job.location,
                          type: job.employmentType,
                          description: job.description,
                        }}
                      />

                      <DeleteJobDialog
                        jobId={job.id}
                        jobTitle={job.title}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-12 text-center">
            <h2 className="text-xl font-semibold text-white">
              No jobs yet
            </h2>

            <p className="mt-2 text-slate-400">
              Create your first job opening to start hiring candidates.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
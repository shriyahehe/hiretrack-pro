import Link from "next/link";
import {
  ArrowLeft,
  Briefcase,
  Mail,
  MapPin,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type Candidate = {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
};

type Job = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  employmentType: string | null;
  description: string | null;
  status: string;
  createdAt: string;
  Candidate: Candidate[];
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

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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
        id,
        fullName,
        email,
        position,
        status
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const job = data as unknown as Job;
  const candidateCount = job.Candidate?.length ?? 0;

  return (
    <div className="min-h-full bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        <Link
          href="/jobs"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Jobs
        </Link>

        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white">
              {job.title}
            </h1>

            <p className="mt-2 text-lg text-slate-400">
              {job.department || "No department"}
            </p>
          </div>

          <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
            {formatValue(job.status)}
          </span>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <MapPin className="h-6 w-6 text-blue-400" />

            <p className="mt-4 text-sm text-slate-500">
              Location
            </p>

            <p className="mt-1 font-medium text-white">
              {job.location || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <Briefcase className="h-6 w-6 text-blue-400" />

            <p className="mt-4 text-sm text-slate-500">
              Employment Type
            </p>

            <p className="mt-1 font-medium text-white">
              {formatValue(job.employmentType)}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <Users className="h-6 w-6 text-blue-400" />

            <p className="mt-4 text-sm text-slate-500">
              Candidates
            </p>

            <p className="mt-1 font-medium text-white">
              {candidateCount}{" "}
              {candidateCount === 1
                ? "Candidate"
                : "Candidates"}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold text-white">
            Job Description
          </h2>

          <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">
            {job.description ||
              "No description added for this job."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">
                Assigned Candidates
              </h2>

              <p className="mt-1 text-sm text-slate-400">
                Candidates currently assigned to this job.
              </p>
            </div>

            <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
              {candidateCount}
            </span>
          </div>

          {candidateCount > 0 ? (
            <div className="mt-6 space-y-4">
              {job.Candidate.map((candidate) => (
                <Link
                  key={candidate.id}
                  href={`/candidates/${candidate.id}`}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950 p-5 transition hover:border-blue-500/50 hover:bg-slate-900"
                >
                  <div>
                    <h3 className="font-semibold text-white">
                      {candidate.fullName}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {candidate.position}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <Mail className="h-4 w-4" />
                      {candidate.email}
                    </div>
                  </div>

                  <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                    {formatValue(candidate.status)}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 py-12 text-center">
              <Users className="mx-auto h-8 w-8 text-slate-600" />

              <h3 className="mt-4 font-semibold text-white">
                No candidates assigned
              </h3>

              <p className="mt-2 text-sm text-slate-400">
                Assign candidates to this job from the Candidates page.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
import Link from "next/link";
import { ArrowLeft, Briefcase, Mail, Phone } from "lucide-react";
import { notFound } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

type Candidate = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  position: string;
  experience: number;
  notes: string | null;
  status: string;
  jobId: string | null;
  Job: {
    id: string;
    title: string;
    department: string;
  } | null;
};

export default async function CandidateDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Candidate")
    .select(`
      id,
      fullName,
      email,
      phone,
      position,
      experience,
      notes,
      status,
      jobId,
      Job (
        id,
        title,
        department
      )
    `)
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const candidate = data as unknown as Candidate;

  return (
    <div className="min-h-full bg-slate-950 p-8 text-white">
      <Link
        href="/candidates"
        className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Candidates
      </Link>

      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-4xl font-bold text-white">
            {candidate.fullName}
          </h1>

          <p className="mt-2 text-lg text-slate-400">
            {candidate.position}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Candidate Information
            </h2>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-blue-400" />

                <div>
                  <p className="text-sm text-slate-500">
                    Email
                  </p>

                  <p className="text-slate-200">
                    {candidate.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-blue-400" />

                <div>
                  <p className="text-sm text-slate-500">
                    Phone
                  </p>

                  <p className="text-slate-200">
                    {candidate.phone || "Not provided"}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Experience
                </p>

                <p className="mt-1 text-slate-200">
                  {candidate.experience}{" "}
                  {candidate.experience === 1
                    ? "year"
                    : "years"}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Status
                </p>

                <span className="mt-2 inline-flex rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                  {candidate.status}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-xl font-semibold text-white">
              Assigned Job
            </h2>

            {candidate.Job ? (
              <Link
                href={`/jobs/${candidate.Job.id}`}
                className="block rounded-xl border border-slate-700 bg-slate-950 p-5 transition hover:border-blue-500/60 hover:bg-slate-900"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-600/20 p-3">
                    <Briefcase className="h-5 w-5 text-blue-400" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-white">
                      {candidate.Job.title}
                    </h3>

                    <p className="mt-1 text-sm text-slate-400">
                      {candidate.Job.department}
                    </p>
                  </div>
                </div>
              </Link>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center">
                <Briefcase className="mx-auto h-7 w-7 text-slate-600" />

                <p className="mt-3 text-slate-400">
                  No job assigned
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="mb-4 text-xl font-semibold text-white">
            Notes
          </h2>

          <p className="whitespace-pre-wrap text-slate-300">
            {candidate.notes || "No notes added for this candidate."}
          </p>
        </div>
      </div>
    </div>
  );
}
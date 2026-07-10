import { createClient } from "@/lib/supabase/server";

export default async function CandidatesPage() {
  const supabase = await createClient();

  const { data: candidates, error } = await supabase
    .from("Candidate")
    .select("*")
    .order("createdAt", { ascending: false });

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 p-8">
        <h1 className="mb-6 text-3xl font-bold text-white">
          Candidates
        </h1>

        <div className="rounded-xl border border-red-500 bg-slate-900 p-6">
          <p className="text-red-500">
            Error: {error.message}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-white">
            Candidates
          </h1>
          <p className="mt-2 text-slate-400">
            Manage all your candidates from one place.
          </p>
        </div>

        <button className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700">
          + Add Candidate
        </button>
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        {candidates && candidates.length > 0 ? (
          <div className="space-y-4">
            {candidates.map((candidate) => (
              <div
                key={candidate.id}
                className="rounded-lg border border-slate-700 bg-slate-950 p-5 transition hover:border-blue-500"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">
                      {candidate.fullName}
                    </h2>

                    <p className="mt-1 text-slate-400">
                      {candidate.position}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {candidate.email}
                    </p>
                  </div>

                  <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                    {candidate.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 text-center">
            <h2 className="text-xl font-semibold text-white">
              No candidates yet
            </h2>

            <p className="mt-2 text-slate-400">
              Click the button above to add your first candidate.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
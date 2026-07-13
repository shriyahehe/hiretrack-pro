import AddCandidateDialog from "@/components/candidates/AddCandidateDialog";
import CandidateList from "@/components/candidates/CandidateList";
import { createClient } from "@/lib/supabase/server";

type Candidate = {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
};

export default async function CandidatesPage() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("Candidate")
    .select("id, fullName, email, position, status")
    .order("createdAt", { ascending: false });

  const candidates = (data ?? []) as Candidate[];

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

        <AddCandidateDialog />
      </div>

      <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
        {candidates.length > 0 ? (
          <CandidateList candidates={candidates} />
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
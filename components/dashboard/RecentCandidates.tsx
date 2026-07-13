import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/server";

type Candidate = {
  id: string;
  fullName: string;
  position: string;
  status: string;
  createdAt: string;
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

export default async function RecentCandidates() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("Candidate")
    .select("id, fullName, position, status, createdAt")
    .order("createdAt", { ascending: false })
    .limit(5);

  const candidates = (data ?? []) as Candidate[];

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Recent Candidates
      </h2>

      {candidates.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidates.map((candidate) => (
              <TableRow key={candidate.id}>
                <TableCell className="font-medium text-white">
                  {candidate.fullName}
                </TableCell>

                <TableCell className="text-slate-300">
                  {candidate.position}
                </TableCell>

                <TableCell>
                  <Badge>
                    {formatValue(candidate.status)}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p className="py-10 text-center text-slate-400">
          No candidates added yet.
        </p>
      )}
    </div>
  );
}
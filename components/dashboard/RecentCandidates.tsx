import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Badge } from "@/components/ui/badge";

const candidates = [
  {
    name: "Priya Sharma",
    role: "Frontend Developer",
    stage: "Interview",
    status: "Pending",
  },
  {
    name: "Rahul Verma",
    role: "Backend Developer",
    stage: "Review",
    status: "Reviewing",
  },
  {
    name: "Aisha Khan",
    role: "UI Designer",
    stage: "Offer",
    status: "Offer Sent",
  },
];

export default function RecentCandidates() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Recent Candidates
      </h2>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Position</TableHead>
            <TableHead>Stage</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.name}>
              <TableCell className="font-medium text-white">
                {candidate.name}
              </TableCell>

              <TableCell>{candidate.role}</TableCell>

              <TableCell>{candidate.stage}</TableCell>

              <TableCell>
                <Badge>{candidate.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
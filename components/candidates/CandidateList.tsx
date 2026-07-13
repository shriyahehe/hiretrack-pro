"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import DeleteCandidateDialog from "@/components/candidates/DeleteCandidateDialog";
import EditCandidateDialog from "@/components/candidates/EditCandidateDialog";
import { Input } from "@/components/ui/input";
import Link from "next/link";
type Candidate = {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
};

interface CandidateListProps {
  candidates: Candidate[];
}

const statuses = [
  "ALL",
  "APPLIED",
  "SCREENING",
  "INTERVIEW",
  "OFFER",
  "HIRED",
  "REJECTED",
];

function formatStatus(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

export default function CandidateList({
  candidates,
}: CandidateListProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const searchValue = search.toLowerCase().trim();

      const matchesSearch =
        candidate.fullName.toLowerCase().includes(searchValue) ||
        candidate.email.toLowerCase().includes(searchValue) ||
        candidate.position.toLowerCase().includes(searchValue);

      const matchesStatus =
        status === "ALL" || candidate.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [candidates, search, status]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />

          <Input
            type="search"
            placeholder="Search candidates..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="h-11 border-slate-700 bg-slate-900 pl-10 text-white"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-11 rounded-md border border-slate-700 bg-slate-900 px-4 text-sm text-white outline-none"
        >
          {statuses.map((candidateStatus) => (
            <option
              key={candidateStatus}
              value={candidateStatus}
            >
              {candidateStatus === "ALL"
                ? "All Statuses"
                : formatStatus(candidateStatus)}
            </option>
          ))}
        </select>
      </div>

      {filteredCandidates.length > 0 ? (
        <div className="space-y-4">
          {filteredCandidates.map((candidate) => (
            <div
              key={candidate.id}
              className="rounded-lg border border-slate-700 bg-slate-950 p-5 transition hover:border-blue-500"
            >
              <div className="flex items-center justify-between gap-4">
                <Link
  href={`/candidates/${candidate.id}`}
  className="min-w-0 flex-1"
>
  <h2 className="text-xl font-semibold text-white transition hover:text-blue-400">
    {candidate.fullName}
  </h2>

  <p className="mt-1 text-slate-400">
    {candidate.position}
  </p>

  <p className="mt-1 text-sm text-slate-500">
    {candidate.email}
  </p>
</Link>

                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-600/20 px-3 py-1 text-sm text-blue-400">
                    {formatStatus(candidate.status)}
                  </span>

                  <EditCandidateDialog candidate={candidate} />
                  <DeleteCandidateDialog candidate={candidate} />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center">
          <h2 className="text-xl font-semibold text-white">
            No candidates found
          </h2>

          <p className="mt-2 text-slate-400">
            Try changing your search or status filter.
          </p>
        </div>
      )}
    </div>
  );
}
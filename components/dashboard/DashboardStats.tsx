import {
  Users,
  CalendarDays,
  Briefcase,
  UserCheck,
} from "lucide-react";

import StatCard from "./StatCard";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardStats() {
  const supabase = await createClient();

  const [
    candidatesResult,
    interviewsResult,
    jobsResult,
    hiredResult,
  ] = await Promise.all([
    supabase
      .from("Candidate")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("Interview")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("Job")
      .select("*", { count: "exact", head: true })
      .eq("status", "OPEN"),

    supabase
      .from("Candidate")
      .select("*", { count: "exact", head: true })
      .eq("status", "HIRED"),
  ]);

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Candidates"
        value={String(candidatesResult.count ?? 0)}
        change="Total candidates"
        icon={Users}
      />

      <StatCard
        title="Interviews"
        value={String(interviewsResult.count ?? 0)}
        change="Total interviews"
        icon={CalendarDays}
      />

      <StatCard
        title="Open Jobs"
        value={String(jobsResult.count ?? 0)}
        change="Active positions"
        icon={Briefcase}
      />

      <StatCard
        title="Hired"
        value={String(hiredResult.count ?? 0)}
        change="Successful hires"
        icon={UserCheck}
      />
    </div>
  );
}
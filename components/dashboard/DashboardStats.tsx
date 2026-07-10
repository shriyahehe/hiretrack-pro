import {
  Users,
  CalendarDays,
  Briefcase,
  UserCheck,
} from "lucide-react";

import StatCard from "./StatCard";

export default function DashboardStats() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        title="Candidates"
        value="248"
        change="+12 this week"
        icon={Users}
      />

      <StatCard
        title="Interviews"
        value="18"
        change="+4 today"
        icon={CalendarDays}
      />

      <StatCard
        title="Open Jobs"
        value="9"
        change="2 added"
        icon={Briefcase}
      />

      <StatCard
        title="Hired"
        value="42"
        change="+3 this month"
        icon={UserCheck}
      />
    </div>
  );
}
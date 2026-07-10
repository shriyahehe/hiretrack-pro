import DashboardStats from "@/components/dashboard/DashboardStats";
import RecentCandidates from "@/components/dashboard/RecentCandidates";
import HiringChart from "@/components/dashboard/HiringChart";
import UpcomingInterviews from "@/components/dashboard/UpcomingInterviews";
export default function DashboardPage() {
  return (
  <div className="space-y-8">
    <div>
      <h1 className="text-4xl font-bold text-white">
        Welcome back 👋
      </h1>

      <p className="mt-2 text-slate-400">
        Here's what's happening with your hiring pipeline today.
      </p>
    </div>

    <DashboardStats />

<RecentCandidates />

<div className="grid gap-6 lg:grid-cols-3">
  <div className="lg:col-span-2">
    <HiringChart />
  </div>

  <UpcomingInterviews />
</div>
  </div>
);
}
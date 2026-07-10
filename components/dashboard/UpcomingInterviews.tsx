import { CalendarDays, Clock } from "lucide-react";

const interviews = [
  {
    candidate: "Priya Sharma",
    role: "Frontend Developer",
    time: "09:00 AM",
  },
  {
    candidate: "Rahul Verma",
    role: "Backend Developer",
    time: "11:30 AM",
  },
  {
    candidate: "Aisha Khan",
    role: "UI Designer",
    time: "03:00 PM",
  },
];

export default function UpcomingInterviews() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="mb-6 flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-blue-500" />
        <h2 className="text-xl font-semibold text-white">
          Upcoming Interviews
        </h2>
      </div>

      <div className="space-y-5">
        {interviews.map((item) => (
          <div
            key={item.candidate}
            className="rounded-xl border border-slate-800 p-4 hover:border-blue-500 transition"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white">
                  {item.candidate}
                </p>

                <p className="text-sm text-slate-400">
                  {item.role}
                </p>
              </div>

              <div className="flex items-center gap-2 text-blue-400">
                <Clock className="h-4 w-4" />
                {item.time}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
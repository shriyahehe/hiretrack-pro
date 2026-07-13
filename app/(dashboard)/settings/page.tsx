import { Bell, ShieldCheck, UserRound } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "No email available";

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    "HireTrack User";

  return (
    <div className="min-h-full bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>

          <p className="mt-2 text-slate-400">
            Manage your HireTrack account and preferences.
          </p>
        </div>

        <div className="grid gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-600/20 p-3">
                <UserRound className="h-6 w-6 text-blue-400" />
              </div>

              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  Account Information
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Your current HireTrack account details.
                </p>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Name
                    </p>

                    <p className="mt-2 font-medium text-slate-200">
                      {displayName}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950 p-5">
                    <p className="text-sm text-slate-500">
                      Email
                    </p>

                    <p className="mt-2 font-medium text-slate-200">
                      {email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-blue-600/20 p-3">
                <Bell className="h-6 w-6 text-blue-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Notifications
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Interview and hiring notifications are available
                  from your dashboard.
                </p>

                <div className="mt-5 rounded-xl border border-slate-800 bg-slate-950 p-5">
                  <p className="font-medium text-slate-200">
                    Hiring activity
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Track candidates, jobs, and scheduled interviews
                    from one workspace.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-emerald-500/10 p-3">
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Account Security
                </h2>

                <p className="mt-1 text-sm text-slate-400">
                  Authentication is securely managed through Supabase.
                </p>

                <div className="mt-5 inline-flex rounded-full bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
                  Account protected
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
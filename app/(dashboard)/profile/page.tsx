import { Mail, UserRound } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "No email available";

  const name =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    email.split("@")[0];

  const initials = name
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word: string) => word.charAt(0).toUpperCase())
    .join("");

  return (
    <div className="min-h-full bg-slate-950 p-8 text-white">
      <div className="mx-auto max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold">Profile</h1>

          <p className="mt-2 text-slate-400">
            View your HireTrack account information.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-8">
          <div className="flex items-center gap-5 border-b border-slate-800 pb-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold">
              {initials || "U"}
            </div>

            <div>
              <h2 className="text-2xl font-semibold">
                {name}
              </h2>

              <p className="mt-1 text-slate-400">
                HireTrack Pro User
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-600/20 p-3">
                <UserRound className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Display Name
                </p>

                <p className="mt-1 text-slate-200">
                  {name}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="rounded-lg bg-blue-600/20 p-3">
                <Mail className="h-5 w-5 text-blue-400" />
              </div>

              <div>
                <p className="text-sm text-slate-500">
                  Email Address
                </p>

                <p className="mt-1 text-slate-200">
                  {email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type UserInfo = {
  email: string;
  initials: string;
};

type Interview = {
  id: string;
  scheduledAt: string;
};

export default function Header() {
  const router = useRouter();

  const [user, setUser] = useState<UserInfo | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] =
    useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);

  useEffect(() => {
    async function loadHeaderData() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const email = user.email ?? "User";

        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          email.split("@")[0];

        const initials = name
          .split(/[\s._-]+/)
          .filter(Boolean)
          .slice(0, 2)
          .map((word: string) =>
            word.charAt(0).toUpperCase()
          )
          .join("");

        setUser({
          email,
          initials: initials || "U",
        });
      }

      const { data } = await supabase
        .from("Interview")
        .select("id, scheduledAt")
        .gte("scheduledAt", new Date().toISOString())
        .order("scheduledAt", {
          ascending: true,
        })
        .limit(5);

      setInterviews((data ?? []) as Interview[]);
    }

    loadHeaderData();
  }, []);

  async function handleLogout() {
    const supabase = createClient();

    await supabase.auth.signOut();

    router.push("/login");
    router.refresh();
  }

  return (
    <header className="relative flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-500" />

        <input
          placeholder="Search candidates..."
          className="h-12 w-full rounded-xl border border-slate-700 bg-slate-900 pl-10 pr-4 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
        />
      </div>

      <div className="flex items-center gap-6">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setNotificationsOpen(
                (current) => !current
              );
              setProfileOpen(false);
            }}
            className="relative text-slate-400 transition hover:text-white"
          >
            <Bell className="h-6 w-6" />

            {interviews.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-xs font-semibold text-white">
                {interviews.length}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
              <div className="border-b border-slate-800 p-4">
                <h3 className="font-semibold text-white">
                  Notifications
                </h3>

                <p className="mt-1 text-sm text-slate-400">
                  Upcoming interviews
                </p>
              </div>

              <div className="max-h-80 overflow-y-auto p-2">
                {interviews.length > 0 ? (
                  interviews.map((interview) => (
                    <button
                      key={interview.id}
                      type="button"
                      onClick={() => {
                        setNotificationsOpen(false);
                        router.push("/interviews");
                      }}
                      className="w-full rounded-lg px-3 py-3 text-left transition hover:bg-slate-800"
                    >
                      <p className="text-sm font-medium text-white">
                        Interview scheduled
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {new Date(
                          interview.scheduledAt
                        ).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </button>
                  ))
                ) : (
                  <p className="px-3 py-8 text-center text-sm text-slate-400">
                    No upcoming interviews.
                  </p>
                )}
              </div>

              <div className="border-t border-slate-800 p-2">
                <button
                  type="button"
                  onClick={() => {
                    setNotificationsOpen(false);
                    router.push("/interviews");
                  }}
                  className="w-full rounded-lg px-3 py-2 text-sm text-blue-400 transition hover:bg-slate-800"
                >
                  View all interviews
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setProfileOpen((current) => !current);
              setNotificationsOpen(false);
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white transition hover:bg-blue-500"
          >
            {user?.initials ?? "U"}
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-xl border border-slate-700 bg-slate-900 shadow-2xl">
              <div className="border-b border-slate-800 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
                    {user?.initials ?? "U"}
                  </div>

                  <div className="min-w-0">
                    <p className="font-medium text-white">
                      My Account
                    </p>

                    <p className="truncate text-sm text-slate-400">
                      {user?.email ?? "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-2">
                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/settings");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/profile");
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-slate-300 transition hover:bg-slate-800 hover:text-white"
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-red-400 transition hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
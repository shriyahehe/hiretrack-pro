"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-800 bg-slate-950 px-8">
      <div className="relative w-96">
        <Search className="absolute left-3 top-3 h-5 w-5 text-slate-500" />

        <Input
          placeholder="Search candidates..."
          className="pl-10 h-12 rounded-xl border-slate-700 bg-slate-900"
        />
      </div>

      <div className="flex items-center gap-6">
        <Bell className="h-6 w-6 cursor-pointer text-slate-400 hover:text-white" />

        <Avatar>
          <AvatarFallback>SS</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
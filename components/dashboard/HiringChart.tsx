"use client";

import { useEffect, useState } from "react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { createClient } from "@/lib/supabase/client";

type ChartData = {
  month: string;
  candidates: number;
};

export default function HiringChart() {
  const [data, setData] = useState<ChartData[]>([]);

  useEffect(() => {
    async function loadCandidates() {
      const supabase = createClient();

      const { data: candidates } = await supabase
        .from("Candidate")
        .select("createdAt")
        .order("createdAt", {
          ascending: true,
        });

      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const counts: Record<string, number> = {};

      candidates?.forEach((candidate) => {
        const date = new Date(candidate.createdAt);
        const month = months[date.getMonth()];

        counts[month] = (counts[month] ?? 0) + 1;
      });

      const chartData = months.map((month) => ({
        month,
        candidates: counts[month] ?? 0,
      }));

      setData(chartData);
    }

    loadCandidates();
  }, []);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h2 className="mb-6 text-xl font-semibold text-white">
        Hiring Analytics
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid stroke="#1E293B" />

            <XAxis
              dataKey="month"
              stroke="#94A3B8"
            />

            <YAxis
              stroke="#94A3B8"
              allowDecimals={false}
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="candidates"
              stroke="#2563EB"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
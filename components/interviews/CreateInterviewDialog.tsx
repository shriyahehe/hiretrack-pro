"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient } from "@/lib/supabase/client";

type Candidate = {
  id: string;
  fullName: string;
};

export default function CreateInterviewDialog() {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState<Candidate[]>([]);

  const [form, setForm] = useState({
    candidateId: "",
    scheduledAt: "",
    type: "VIDEO",
    notes: "",
  });

  useEffect(() => {
    async function loadCandidates() {
      const { data, error } = await supabase
        .from("Candidate")
        .select("id, fullName")
        .order("fullName", { ascending: true });

      if (error) {
        toast.error("Unable to load candidates", {
          description: error.message,
        });

        return;
      }

      setCandidates((data ?? []) as Candidate[]);
    }

    if (open) {
      loadCandidates();
    }
  }, [open]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.candidateId || !form.scheduledAt) {
      toast.error("Missing required fields", {
        description:
          "Please select a candidate and interview date.",
      });

      return;
    }

    setLoading(true);

    const { data: userData } =
      await supabase.auth.getUser();

    const user = userData.user;

    if (!user) {
      setLoading(false);

      toast.error("Unable to schedule interview", {
        description: "Please log in again.",
      });

      return;
    }

    const { error } = await supabase
      .from("Interview")
      .insert([
        {
          candidateId: form.candidateId,
          scheduledAt: new Date(
            form.scheduledAt
          ).toISOString(),
          type: form.type,
          notes: form.notes.trim() || null,
          userId: user.id,
        },
      ]);

    setLoading(false);

    if (error) {
      toast.error("Unable to schedule interview", {
        description: error.message,
      });

      return;
    }

    toast.success("Interview scheduled successfully");

    setForm({
      candidateId: "",
      scheduledAt: "",
      type: "VIDEO",
      notes: "",
    });

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="h-12 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700">
          <Plus className="mr-2 h-5 w-5" />
          Schedule Interview
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-800 bg-slate-950 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <CalendarDays className="h-5 w-5 text-blue-400" />
            Schedule Interview
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Schedule an interview with a candidate.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="candidate">
              Candidate
            </Label>

            <select
              id="candidate"
              value={form.candidateId}
              onChange={(event) =>
                setForm({
                  ...form,
                  candidateId: event.target.value,
                })
              }
              className="h-11 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-white outline-none focus:border-blue-500"
              required
            >
              <option value="">
                Select candidate
              </option>

              {candidates.map((candidate) => (
                <option
                  key={candidate.id}
                  value={candidate.id}
                >
                  {candidate.fullName}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="scheduledAt">
              Date and Time
            </Label>

            <Input
              id="scheduledAt"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(event) =>
                setForm({
                  ...form,
                  scheduledAt: event.target.value,
                })
              }
              className="border-slate-700 bg-slate-900 text-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">
              Interview Type
            </Label>

            <select
              id="type"
              value={form.type}
              onChange={(event) =>
                setForm({
                  ...form,
                  type: event.target.value,
                })
              }
              className="h-11 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-white outline-none focus:border-blue-500"
            >
              <option value="VIDEO">
                Video
              </option>

              <option value="PHONE">
                Phone
              </option>

              <option value="IN_PERSON">
                In Person
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes
            </Label>

            <textarea
              id="notes"
              value={form.notes}
              onChange={(event) =>
                setForm({
                  ...form,
                  notes: event.target.value,
                })
              }
              placeholder="Add interview notes..."
              className="min-h-28 w-full resize-none rounded-md border border-slate-700 bg-slate-900 p-3 text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-700 bg-transparent text-white hover:bg-slate-800"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? "Scheduling..."
                : "Schedule Interview"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
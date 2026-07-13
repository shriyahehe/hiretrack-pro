"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

type Job = {
  id: string;
  title: string;
  department: string;
};

export default function AddCandidateDialog() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jobsLoading, setJobsLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    notes: "",
    jobId: "",
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    async function loadJobs() {
      setJobsLoading(true);

      const supabase = createClient();

      const { data, error } = await supabase
        .from("Job")
        .select("id, title, department")
        .eq("status", "OPEN")
        .order("createdAt", {
          ascending: false,
        });

      setJobsLoading(false);

      if (error) {
        toast.error("Unable to load jobs", {
          description: error.message,
        });

        return;
      }

      setJobs((data ?? []) as Job[]);
    }

    loadJobs();
  }, [open]);

  function resetForm() {
    setForm({
      fullName: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      notes: "",
      jobId: "",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    const supabase = createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);

      toast.error("You must be logged in", {
        description: "Please sign in before adding a candidate.",
      });

      return;
    }

    const selectedJob = jobs.find(
      (job) => job.id === form.jobId
    );

    const { error } = await supabase
      .from("Candidate")
      .insert([
        {
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || null,
          position:
            selectedJob?.title ||
            form.position.trim(),
          experience: Number(form.experience),
          notes: form.notes.trim() || null,
          jobId: form.jobId || null,
          userId: user.id,
        },
      ]);

    setLoading(false);

    if (error) {
      toast.error("Unable to add candidate", {
        description: error.message,
      });

      return;
    }

    toast.success("Candidate added successfully", {
      description: `${form.fullName} has been added to HireTrack.`,
    });

    resetForm();
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);

        if (!value && !loading) {
          resetForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" />
          Add Candidate
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-950 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            Add Candidate
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Add a candidate and assign them to an open job.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="mt-4 space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="fullName">
              Full Name
            </Label>

            <Input
              id="fullName"
              required
              placeholder="Priya Sharma"
              value={form.fullName}
              onChange={(event) =>
                setForm({
                  ...form,
                  fullName: event.target.value,
                })
              }
              className="h-11 border-slate-700 bg-slate-900"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">
                Email
              </Label>

              <Input
                id="email"
                type="email"
                required
                placeholder="priya@example.com"
                value={form.email}
                onChange={(event) =>
                  setForm({
                    ...form,
                    email: event.target.value,
                  })
                }
                className="h-11 border-slate-700 bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone
              </Label>

              <Input
                id="phone"
                type="tel"
                placeholder="+91 98765 43210"
                value={form.phone}
                onChange={(event) =>
                  setForm({
                    ...form,
                    phone: event.target.value,
                  })
                }
                className="h-11 border-slate-700 bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Assign to Job
            </Label>

            <Select
              value={form.jobId}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  jobId: value,
                })
              }
            >
              <SelectTrigger className="h-11 w-full border-slate-700 bg-slate-900">
                <SelectValue
                  placeholder={
                    jobsLoading
                      ? "Loading jobs..."
                      : "Select an open job"
                  }
                />
              </SelectTrigger>

              <SelectContent>
                {jobs.map((job) => (
                  <SelectItem
                    key={job.id}
                    value={job.id}
                  >
                    {job.title} · {job.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {!jobsLoading && jobs.length === 0 && (
              <p className="text-sm text-slate-500">
                No open jobs found. You can enter a position manually below.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">
              Position
            </Label>

            <Input
              id="position"
              required={!form.jobId}
              disabled={Boolean(form.jobId)}
              placeholder="Frontend Developer"
              value={
                jobs.find(
                  (job) => job.id === form.jobId
                )?.title || form.position
              }
              onChange={(event) =>
                setForm({
                  ...form,
                  position: event.target.value,
                })
              }
              className="h-11 border-slate-700 bg-slate-900 disabled:opacity-70"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experience">
              Years of Experience
            </Label>

            <Input
              id="experience"
              type="number"
              min="0"
              required
              placeholder="2"
              value={form.experience}
              onChange={(event) =>
                setForm({
                  ...form,
                  experience: event.target.value,
                })
              }
              className="h-11 border-slate-700 bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">
              Notes
            </Label>

            <Textarea
              id="notes"
              rows={4}
              placeholder="Add notes about the candidate..."
              value={form.notes}
              onChange={(event) =>
                setForm({
                  ...form,
                  notes: event.target.value,
                })
              }
              className="resize-none border-slate-700 bg-slate-900"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={() => setOpen(false)}
              className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading
                ? "Saving..."
                : "Save Candidate"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
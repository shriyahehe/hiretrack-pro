"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Job = {
  id: string;
  title: string;
  department: string | null;
  location: string | null;
  type: string | null;
  description: string | null;
};

interface EditJobDialogProps {
  job: Job;
}

export default function EditJobDialog({
  job,
}: EditJobDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: job.title,
    department: job.department ?? "",
    location: job.location ?? "",
    type: job.type ?? "",
    description: job.description ?? "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!form.title.trim()) {
      toast.error("Job title is required");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from("Job")
      .update({
        title: form.title.trim(),
        department: form.department.trim() || null,
        location: form.location.trim() || null,
        employmentType: form.type.trim() || null,
        description: form.description.trim() || null,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", job.id);

    setLoading(false);

    if (error) {
      toast.error("Unable to update job", {
        description: error.message,
      });

      return;
    }

    toast.success("Job updated successfully");

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-slate-700 bg-slate-900 text-slate-300 hover:bg-slate-800 hover:text-white"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-800 bg-slate-950 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Edit Job</DialogTitle>

          <DialogDescription className="text-slate-400">
            Update the job opening details.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`title-${job.id}`}>
              Job Title
            </Label>

            <Input
              id={`title-${job.id}`}
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Full Stack Developer"
              className="border-slate-700 bg-slate-900"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`department-${job.id}`}>
                Department
              </Label>

              <Input
                id={`department-${job.id}`}
                name="department"
                value={form.department}
                onChange={handleChange}
                placeholder="Engineering"
                className="border-slate-700 bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`location-${job.id}`}>
                Location
              </Label>

              <Input
                id={`location-${job.id}`}
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="Remote"
                className="border-slate-700 bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`type-${job.id}`}>
              Job Type
            </Label>

            <Input
              id={`type-${job.id}`}
              name="type"
              value={form.type}
              onChange={handleChange}
              placeholder="Full-time"
              className="border-slate-700 bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`description-${job.id}`}>
              Description
            </Label>

            <textarea
              id={`description-${job.id}`}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the role and responsibilities..."
              rows={5}
              className="w-full resize-none rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-500 focus:border-blue-500"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="border-slate-700 bg-slate-900"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
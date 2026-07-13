"use client";

import { useState } from "react";
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

export default function CreateJobDialog() {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    department: "",
    location: "",
    employmentType: "",
    description: "",
  });

  function resetForm() {
    setForm({
      title: "",
      department: "",
      location: "",
      employmentType: "",
      description: "",
    });
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      setLoading(false);

      toast.error("You must be logged in", {
        description: "Please sign in before creating a job.",
      });

      return;
    }

    const { error } = await supabase.from("Job").insert([
      {
        title: form.title.trim(),
        department: form.department.trim(),
        location: form.location.trim(),
        employmentType: form.employmentType,
        description: form.description.trim() || null,
        userId: user.id,
      },
    ]);

    setLoading(false);

    if (error) {
      toast.error("Unable to create job", {
        description: error.message,
      });

      return;
    }

    toast.success("Job created successfully", {
      description: `${form.title} has been added to HireTrack.`,
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
          Create Job
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border-slate-800 bg-slate-950 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-white">
            Create Job
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Add a new position to your hiring pipeline.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="job-title">
              Job Title
            </Label>

            <Input
              id="job-title"
              required
              placeholder="Frontend Developer"
              value={form.title}
              onChange={(event) =>
                setForm({
                  ...form,
                  title: event.target.value,
                })
              }
              className="h-11 border-slate-700 bg-slate-900"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="department">
                Department
              </Label>

              <Input
                id="department"
                required
                placeholder="Engineering"
                value={form.department}
                onChange={(event) =>
                  setForm({
                    ...form,
                    department: event.target.value,
                  })
                }
                className="h-11 border-slate-700 bg-slate-900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location
              </Label>

              <Input
                id="location"
                required
                placeholder="Bengaluru"
                value={form.location}
                onChange={(event) =>
                  setForm({
                    ...form,
                    location: event.target.value,
                  })
                }
                className="h-11 border-slate-700 bg-slate-900"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Employment Type</Label>

            <Select
              value={form.employmentType}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  employmentType: value,
                })
              }
            >
              <SelectTrigger className="h-11 w-full border-slate-700 bg-slate-900">
                <SelectValue placeholder="Select employment type" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="FULL_TIME">
                  Full Time
                </SelectItem>

                <SelectItem value="PART_TIME">
                  Part Time
                </SelectItem>

                <SelectItem value="CONTRACT">
                  Contract
                </SelectItem>

                <SelectItem value="INTERNSHIP">
                  Internship
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="job-description">
              Description
            </Label>

            <Textarea
              id="job-description"
              rows={5}
              placeholder="Describe the role and responsibilities..."
              value={form.description}
              onChange={(event) =>
                setForm({
                  ...form,
                  description: event.target.value,
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
              disabled={
                loading ||
                !form.employmentType
              }
              className="bg-blue-600 text-white hover:bg-blue-700"
            >
              {loading ? "Creating..." : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

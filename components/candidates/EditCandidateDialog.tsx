"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
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

type Candidate = {
  id: string;
  fullName: string;
  email: string;
  position: string;
  status: string;
};

interface EditCandidateDialogProps {
  candidate: Candidate;
}

export default function EditCandidateDialog({
  candidate,
}: EditCandidateDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: candidate.fullName,
    email: candidate.email,
    position: candidate.position,
    status: candidate.status,
  });

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("Candidate")
      .update({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        position: form.position.trim(),
        status: form.status,
        updatedAt: new Date().toISOString(),
      })
      .eq("id", candidate.id);

    setLoading(false);

    if (error) {
      toast.error("Unable to update candidate", {
        description: error.message,
      });

      return;
    }

    toast.success("Candidate updated successfully", {
      description: `${form.fullName} has been updated.`,
    });

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-800 bg-slate-950 text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">
            Edit Candidate
          </DialogTitle>

          <DialogDescription className="text-slate-400">
            Update candidate information and hiring status.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 space-y-5">
          <div className="space-y-2">
            <Label htmlFor={`name-${candidate.id}`}>
              Full Name
            </Label>

            <Input
              id={`name-${candidate.id}`}
              required
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

          <div className="space-y-2">
            <Label htmlFor={`email-${candidate.id}`}>
              Email
            </Label>

            <Input
              id={`email-${candidate.id}`}
              type="email"
              required
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
            <Label htmlFor={`position-${candidate.id}`}>
              Position
            </Label>

            <Input
              id={`position-${candidate.id}`}
              required
              value={form.position}
              onChange={(event) =>
                setForm({
                  ...form,
                  position: event.target.value,
                })
              }
              className="h-11 border-slate-700 bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>

            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm({
                  ...form,
                  status: value,
                })
              }
            >
              <SelectTrigger className="h-11 w-full border-slate-700 bg-slate-900">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="APPLIED">
                  Applied
                </SelectItem>

                <SelectItem value="SCREENING">
                  Screening
                </SelectItem>

                <SelectItem value="INTERVIEW">
                  Interview
                </SelectItem>

                <SelectItem value="OFFER">
                  Offer
                </SelectItem>

                <SelectItem value="HIRED">
                  Hired
                </SelectItem>

                <SelectItem value="REJECTED">
                  Rejected
                </SelectItem>
              </SelectContent>
            </Select>
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
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
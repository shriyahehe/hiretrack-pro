"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

import { createClient } from "@/lib/supabase/client";

type Interview = {
  id: string;
  scheduledAt: string;
  type: string;
  status: string;
  notes: string | null;
};

type Props = {
  interview: Interview;
};

export default function EditInterviewDialog({
  interview,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [scheduledAt, setScheduledAt] = useState(
    new Date(interview.scheduledAt)
      .toISOString()
      .slice(0, 16)
  );

  const [type, setType] = useState(interview.type);
  const [status, setStatus] = useState(interview.status);
  const [notes, setNotes] = useState(
    interview.notes || ""
  );

  async function handleUpdate() {
    setLoading(true);

    const { error } = await supabase
      .from("Interview")
      .update({
        scheduledAt: new Date(
          scheduledAt
        ).toISOString(),
        type,
        status,
        notes: notes.trim() || null,
      })
      .eq("id", interview.id);

    setLoading(false);

    if (error) {
      toast.error("Unable to update interview", {
        description: error.message,
      });

      return;
    }

    toast.success("Interview updated successfully");

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:bg-blue-500/10 hover:text-blue-400"
        >
          <Pencil className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-800 bg-slate-950 text-white">
        <DialogHeader>
          <DialogTitle>Edit Interview</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <Label>Date and Time</Label>

            <Input
              type="datetime-local"
              value={scheduledAt}
              onChange={(event) =>
                setScheduledAt(event.target.value)
              }
              className="border-slate-700 bg-slate-900"
            />
          </div>

          <div className="space-y-2">
            <Label>Interview Type</Label>

            <select
              value={type}
              onChange={(event) =>
                setType(event.target.value)
              }
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white"
            >
              <option value="VIDEO">Video</option>
              <option value="PHONE">Phone</option>
              <option value="IN_PERSON">
                In Person
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Status</Label>

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white"
            >
              <option value="SCHEDULED">
                Scheduled
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>

            <Textarea
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
              placeholder="Interview notes..."
              className="min-h-28 border-slate-700 bg-slate-900"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            className="border-slate-700 bg-transparent text-white hover:bg-slate-800"
          >
            Cancel
          </Button>

          <Button
            onClick={handleUpdate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500"
          >
            {loading ? "Updating..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
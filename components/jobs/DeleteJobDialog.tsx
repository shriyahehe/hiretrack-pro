"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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

interface DeleteJobDialogProps {
  jobId: string;
  jobTitle: string;
}

export default function DeleteJobDialog({
  jobId,
  jobTitle,
}: DeleteJobDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const { error } = await supabase
      .from("Job")
      .delete()
      .eq("id", jobId);

    setLoading(false);

    if (error) {
      toast.error("Unable to delete job", {
        description: error.message,
      });

      return;
    }

    toast.success("Job deleted successfully", {
      description: `${jobTitle} has been removed from HireTrack.`,
    });

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-red-900/60 bg-red-950/30 text-red-400 hover:bg-red-950 hover:text-red-300"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-800 bg-slate-950 text-white sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Delete Job</DialogTitle>

          <DialogDescription className="text-slate-400">
            Are you sure you want to delete{" "}
            <span className="font-medium text-white">
              {jobTitle}
            </span>
            ? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={loading}
            className="border-slate-700 bg-slate-900"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Job"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
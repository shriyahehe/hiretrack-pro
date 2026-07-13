"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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

import { createClient } from "@/lib/supabase/client";

type Props = {
  interviewId: string;
  candidateName: string;
};

export default function DeleteInterviewDialog({
  interviewId,
  candidateName,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);

    const { error } = await supabase
      .from("Interview")
      .delete()
      .eq("id", interviewId);

    setLoading(false);

    if (error) {
      toast.error("Unable to delete interview", {
        description: error.message,
      });

      return;
    }

    toast.success("Interview deleted successfully");

    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </DialogTrigger>

      <DialogContent className="border-slate-800 bg-slate-950 text-white">
        <DialogHeader>
          <DialogTitle>Delete Interview</DialogTitle>

          <DialogDescription className="text-slate-400">
            Are you sure you want to delete the interview
            scheduled for {candidateName}? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>

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
            type="button"
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {loading ? "Deleting..." : "Delete Interview"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Candidate = {
  id: string;
  fullName: string;
};

interface DeleteCandidateDialogProps {
  candidate: Candidate;
}

export default function DeleteCandidateDialog({
  candidate,
}: DeleteCandidateDialogProps) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  async function handleDelete(
    event: React.MouseEvent<HTMLButtonElement>
  ) {
    event.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("Candidate")
      .delete()
      .eq("id", candidate.id);

    setLoading(false);

    if (error) {
      toast.error("Unable to delete candidate", {
        description: error.message,
      });

      return;
    }

    toast.success("Candidate deleted", {
      description: `${candidate.fullName} has been removed from HireTrack.`,
    });

    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="text-slate-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="border-slate-800 bg-slate-950 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-white">
            Delete candidate?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-slate-400">
            This will permanently delete{" "}
            <span className="font-medium text-white">
              {candidate.fullName}
            </span>{" "}
            from your hiring pipeline. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
            className="border-slate-700 bg-transparent text-white hover:bg-slate-800 hover:text-white"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            disabled={loading}
            onClick={handleDelete}
            className="bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Deleting..." : "Delete Candidate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
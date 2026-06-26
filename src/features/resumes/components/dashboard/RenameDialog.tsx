"use client";

import { useRef } from "react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/global/components/ui";

interface RenameDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTitle: string;
  onSubmit: (title: string) => void;
}

export function RenameDialog({
  open,
  onOpenChange,
  initialTitle,
  onSubmit,
}: RenameDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  function submit() {
    const next = inputRef.current?.value.trim();
    if (!next) return;
    onSubmit(next);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Rename resume</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="resume-title">Title</Label>
          {/* Uncontrolled + keyed so it resets to the current title each open. */}
          <Input
            key={open ? initialTitle : "closed"}
            id="resume-title"
            ref={inputRef}
            defaultValue={initialTitle}
            autoFocus
            onKeyDown={(e) => e.key === "Enter" && submit()}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={submit}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

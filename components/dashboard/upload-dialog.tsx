"use client";

import { useState } from "react";
import { FileUp, ImagePlus, Layers3 } from "lucide-react";
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

const checklist = [
  "Upload a PDF to begin a session",
  "Prepare PNG or image overlays",
  "Stage page operations before export",
];

export function UploadDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="rounded-full">
          <FileUp className="size-4" />
          Upload PDF
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stage a new PDF editing session</DialogTitle>
          <DialogDescription>
            This UI is ready for your upload API. Connect the form to storage and
            processing when you implement the editor backend.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 pt-4">
          <div className="space-y-2">
            <Label htmlFor="document-name">Document name</Label>
            <Input id="document-name" placeholder="Marketing proposal.pdf" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="pdf-file">PDF file</Label>
            <Input id="pdf-file" type="file" accept="application/pdf" />
          </div>

          <div className="grid gap-3 rounded-3xl border border-border/60 bg-muted/40 p-4">
            {checklist.map((item, index) => {
              const Icon = index === 0 ? FileUp : index === 1 ? ImagePlus : Layers3;

              return (
                <div
                  key={item}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/80 px-4 py-3 text-sm text-muted-foreground"
                >
                  <Icon className="size-4 text-foreground" />
                  {item}
                </div>
              );
            })}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button className="rounded-full" onClick={() => setOpen(false)}>
            Save draft session
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

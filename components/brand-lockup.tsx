import Link from "next/link";
import { FilePenLine } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandLockup({
  href = "/",
  className,
}: {
  href?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-3", className)}
    >
      <div className="flex size-10 items-center justify-center rounded-2xl border border-border/70 bg-card shadow-sm">
        <FilePenLine className="size-5" />
      </div>
      <div>
        <p className="font-display text-2xl leading-none tracking-tight">
          Editly
        </p>
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">
          PDF editor
        </p>
      </div>
    </Link>
  );
}

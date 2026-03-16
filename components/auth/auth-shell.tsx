import Link from "next/link";
import { ArrowLeft, FileStack, ShieldCheck, Sparkles } from "lucide-react";
import { BrandLockup } from "@/components/brand-lockup";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const featureNotes = [
  "Secure account access with NextAuth",
  "Light and dark mode with the same visual language",
  "Structured for upload, edit, and export workflows",
];

export function AuthShell({
  eyebrow,
  title,
  description,
  children,
  alternateHref,
  alternateLabel,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  alternateHref: string;
  alternateLabel: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <BrandLockup />
            <div className="flex items-center gap-2 sm:justify-end">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/">
                  <ArrowLeft className="size-4" />
                  Back to landing
                </Link>
              </Button>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid min-h-[calc(100vh-5.5rem)] w-full max-w-7xl items-center gap-8 px-6 py-12 lg:grid-cols-[minmax(0,1.05fr)_auto_minmax(400px,0.95fr)] lg:px-8">
        <div className="space-y-8">
          <Badge className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            {eyebrow}
          </Badge>
          <div className="space-y-4">
            <h1 className="font-display max-w-3xl text-5xl leading-none tracking-tight sm:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-8 text-muted-foreground sm:text-lg">
              {description}
            </p>
          </div>

          <Card className="border-border/60 bg-card/70 shadow-[0_20px_80px_-56px_rgba(0,0,0,0.9)]">
            <CardContent className="space-y-5 p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-11 items-center justify-center rounded-2xl border border-border/70 bg-muted/70">
                  <FileStack className="size-5" />
                </div>
                <div>
                  <p className="font-semibold tracking-tight">
                    Production-ready shell
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Authentication, theme mode, and dashboard scaffolding are in
                    place.
                  </p>
                </div>
              </div>
              <div className="grid gap-3">
                {featureNotes.map((note) => (
                  <div
                    key={note}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground"
                  >
                    <ShieldCheck className="size-4 text-foreground" />
                    {note}
                  </div>
                ))}
              </div>
              <div className="rounded-3xl bg-primary px-5 py-4 text-primary-foreground">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-primary-foreground/80">
                      Workspace status
                    </p>
                    <p className="mt-1 text-2xl font-semibold">
                      Ready to onboard
                    </p>
                  </div>
                  <Sparkles className="size-5 text-primary-foreground/80" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="hidden h-full min-h-[520px] items-center justify-center lg:flex">
          <div className="relative flex h-full items-center px-2">
            <div className="h-full w-px bg-border/60" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-background px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Auth
            </span>
          </div>
        </div>

        <div className="w-full max-w-xl justify-self-stretch lg:justify-self-end">
          {children}
          <p className="mt-5 text-center text-sm text-muted-foreground">
            <Link
              href={alternateHref}
              className="font-medium text-foreground underline-offset-4 hover:underline"
            >
              {alternateLabel}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

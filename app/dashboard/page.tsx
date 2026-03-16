import Link from "next/link";
import { redirect } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import { getServerSession } from "next-auth";
import { BrandLockup } from "@/components/brand-lockup";
import { PdfEditorWorkspace } from "@/components/dashboard/pdf-editor-workspace";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/sign-in");
  }

  const initials = session.user.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/60 bg-background/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-6 py-5 lg:px-8">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <BrandLockup />
              <Badge className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
                Main dashboard
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-3 xl:justify-end">
              <Button asChild variant="ghost" className="rounded-full">
                <Link href="/">
                  <LayoutDashboard className="size-4" />
                  Back to landing
                </Link>
              </Button>
              <ThemeToggle />
              <SignOutButton />
              <Link href="/profile">
                <div className="flex min-w-[240px] items-center gap-3 rounded-full border border-border/60 bg-card px-3 py-2">
                  <Avatar className="size-10">
                    <AvatarFallback>{initials ?? "EU"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium leading-none">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
            <div className="space-y-3">
              <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
                Edit PDFs with control, not clutter.
              </h1>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                Upload a PDF, add text or PNG overlays, run page operations, and
                download the edited document from one refined workspace.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { label: "Editor mode", value: "Live" },
                { label: "Export flow", value: "Instant" },
                { label: "Theme", value: "Dark / Light" },
              ].map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-[1.5rem] border border-border/60 bg-card/80 px-4 py-4"
                >
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {metric.label}
                  </p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">
                    {metric.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-8 lg:px-8">
        <PdfEditorWorkspace />
      </main>
    </div>
  );
}

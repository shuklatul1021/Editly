import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { UserCircle2 } from "lucide-react";
import { SignOutButton } from "@/components/dashboard/sign-out-button";
import { SiteFooter } from "@/components/site-footer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";

export default async function ProfilePage() {
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
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5 lg:px-8">
          <div className="flex items-center gap-3">
            <UserCircle2 className="size-5 text-muted-foreground" />
            <p className="font-semibold tracking-tight">Profile</p>
            <Badge className="rounded-full border-border/70 bg-background/70 px-3 py-1 text-[0.7rem] uppercase tracking-[0.24em] text-muted-foreground">
              Account
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="ghost" className="rounded-full">
              <Link href="/pricing">Pricing</Link>
            </Button>
            <ThemeToggle />
            <SignOutButton />
          </div>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:px-8">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="text-2xl">User information</CardTitle>
            <CardDescription>
              These details come from your authenticated account session.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Name
              </p>
              <p className="mt-2 text-base font-medium">
                {session.user.name ?? "Not set"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Email
              </p>
              <p className="mt-2 text-base font-medium">
                {session.user.email ?? "Not set"}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                User ID
              </p>
              <p className="mt-2 break-all text-base font-medium">
                {session.user.id}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Auth status
              </p>
              <p className="mt-2 text-base font-medium">Signed in</p>
            </div>
          </CardContent>
        </Card>

        <Card className="h-fit border-border/60 bg-card/70">
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <Avatar className="size-12">
                <AvatarFallback>{initials ?? "EU"}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium leading-none">{session.user.name}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {session.user.email}
                </p>
              </div>
            </div>
            <Button asChild className="w-full rounded-full">
              <Link href="/dashboard">Open editor workspace</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

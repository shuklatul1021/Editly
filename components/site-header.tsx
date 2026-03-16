import Link from "next/link";
import { BrandLockup } from "@/components/brand-lockup";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        <BrandLockup />

        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" className="rounded-full px-4">
            <Link href="/auth/sign-in">Sign in</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-full px-4">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

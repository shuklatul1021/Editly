import Link from "next/link";

const productLinks = [
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
];

const legalLinks = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/cookies", label: "Cookie Policy" },
];

const supportLinks = [
  { href: "/contact", label: "Contact" },
  { href: "/auth/sign-in", label: "Sign in" },
  { href: "/auth/sign-up", label: "Create account" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-background/90">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr] lg:px-8">
        <div className="space-y-3">
          <p className="font-semibold tracking-tight">Editly</p>
          <p className="max-w-sm text-sm leading-7 text-muted-foreground">
            Professional PDF workflows for modern product and operations teams.
            Upload, edit, review, and export with confidence.
          </p>
        </div>

        <nav className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Product
          </p>
          <ul className="space-y-2 text-sm">
            {productLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Legal
          </p>
          <ul className="space-y-2 text-sm">
            {legalLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav className="space-y-3">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Support
          </p>
          <ul className="space-y-2 text-sm">
            {supportLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-muted-foreground transition hover:text-foreground"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-6 py-4 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {new Date().getFullYear()} Editly. All rights reserved.</p>
          <p>
            By using Editly, you agree to our terms, privacy, and cookie
            policies.
          </p>
        </div>
      </div>
    </footer>
  );
}

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const plans = [
  {
    name: "Starter",
    price: "$0",
    frequency: "/ month",
    description: "Best for trying the PDF workflow with core editing tools.",
    features: [
      "Up to 10 exports/month",
      "Single workspace",
      "PNG and text overlays",
    ],
    cta: "Get started",
    href: "/auth/sign-up",
  },
  {
    name: "Pro",
    price: "$19",
    frequency: "/ month",
    description:
      "Built for daily operations teams and client-facing workflows.",
    features: [
      "Unlimited exports",
      "Advanced page operations",
      "Priority email support",
    ],
    cta: "Start Pro",
    href: "/auth/sign-up",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$79",
    frequency: "/ month",
    description: "For teams that need collaboration, governance, and scale.",
    features: [
      "Team seats included",
      "Role-ready architecture",
      "Dedicated onboarding",
    ],
    cta: "Contact sales",
    href: "/auth/sign-up",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="mx-auto w-full max-w-7xl px-6 py-16 lg:px-8">
        <div className="mx-auto max-w-3xl space-y-5 text-center">
          <Badge className="rounded-full border-border/70 bg-background/80 px-4 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground">
            Pricing
          </Badge>
          <h1 className="font-display text-5xl tracking-tight sm:text-6xl">
            Simple pricing for modern PDF operations.
          </h1>
          <p className="text-base leading-8 text-muted-foreground">
            Pick the plan that fits your volume today, then scale up as your
            team and workflows grow.
          </p>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={
                plan.highlighted
                  ? "border-primary/50 bg-card shadow-[0_20px_90px_-50px_rgba(0,0,0,0.9)]"
                  : "border-border/60 bg-card/80"
              }
            >
              <CardHeader className="space-y-4">
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2">
                  <p className="text-4xl font-semibold tracking-tight">
                    {plan.price}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {plan.frequency}
                  </p>
                </div>
                <CardDescription className="leading-7">
                  {plan.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <ul className="space-y-3 text-sm text-muted-foreground">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className="w-full rounded-full"
                  variant={plan.highlighted ? "default" : "outline"}
                >
                  <Link href={plan.href}>{plan.cta}</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

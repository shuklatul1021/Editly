import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileUp,
  ImagePlus,
  Layers3,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
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

const featureCards = [
  {
    title: "Upload and organize",
    description:
      "Bring in contracts, proposals, and reports, then structure pages before you make changes.",
    icon: FileUp,
  },
  {
    title: "Add visuals fast",
    description:
      "Drop in PNGs, logos, signatures, and approval stamps without leaving the editor.",
    icon: ImagePlus,
  },
  {
    title: "Operate with precision",
    description:
      "Merge, reorder, redact, and export from one workspace built for production teams.",
    icon: Layers3,
  },
];

const workflowSteps = [
  "Upload a PDF and detect page structure instantly.",
  "Apply edits like images, overlays, annotations, or page operations.",
  "Export the final version with a clean review trail for your team.",
];

const useCases = [
  {
    title: "Sales and proposals",
    description:
      "Personalize proposal decks with signatures, logos, and revised pricing pages in minutes.",
  },
  {
    title: "Operations and compliance",
    description:
      "Apply stamps, redact sensitive fields, and keep final PDFs consistent across teams.",
  },
  {
    title: "Client delivery",
    description:
      "Merge supporting pages, reorder sections, and ship polished deliverables without extra tools.",
  },
];

const stats = [
  { label: "Export speed", value: "< 20 sec" },
  { label: "Editing tools", value: "12+" },
  { label: "Team workspaces", value: "Unlimited" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-[36rem] bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_46%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.12),transparent_46%),linear-gradient(135deg,rgba(255,255,255,0.1),transparent_40%)]" />

        <section className="mx-auto flex w-full max-w-7xl flex-col gap-14 px-6 pb-24 pt-10 lg:px-8 lg:pb-28 lg:pt-16">
          <div className="grid items-end gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-8">
              <Badge className="rounded-full border-border/70 bg-background/70 px-4 py-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted-foreground shadow-sm backdrop-blur">
                Modern PDF operations
              </Badge>
              <div className="space-y-5">
                <h1 className="font-display max-w-4xl text-5xl leading-none tracking-tight sm:text-6xl lg:text-7xl">
                  Edit PDFs with the polish of a design tool and the control of
                  an ops dashboard.
                </h1>
                <p className="max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
                  Editly gives teams a clean workspace to upload files, place
                  PNGs and signatures, run page operations, and export final
                  PDFs without friction.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="rounded-full px-6">
                  <Link href="/auth/sign-up">
                    Start free
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-full border-border/80 bg-background/60 px-6 backdrop-blur"
                >
                  <Link href="/dashboard">Open dashboard preview</Link>
                </Button>
              </div>
              <div className="grid gap-4 pt-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <Card
                    key={stat.label}
                    className="border-border/60 bg-card/70 shadow-[0_16px_60px_-36px_rgba(0,0,0,0.5)] backdrop-blur"
                  >
                    <CardContent className="space-y-2 p-5">
                      <p className="text-2xl font-semibold tracking-tight">
                        {stat.value}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-6 -z-10 rounded-[2rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.25),transparent_38%)] blur-2xl dark:bg-[linear-gradient(145deg,rgba(255,255,255,0.12),transparent_45%)]" />
              <Card className="overflow-hidden border-border/60 bg-card/80 shadow-[0_30px_120px_-60px_rgba(0,0,0,0.7)] backdrop-blur">
                <CardHeader className="border-b border-border/60 pb-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardDescription>Workspace preview</CardDescription>
                      <CardTitle className="mt-2 text-2xl">
                        Quarterly Report.pdf
                      </CardTitle>
                    </div>
                    <Badge className="rounded-full bg-primary/10 px-3 py-1 text-primary dark:bg-primary/15">
                      Live editor
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 p-6">
                  <div className="rounded-3xl border border-border/60 bg-background/80 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Current action
                        </p>
                        <p className="mt-2 text-xl font-semibold">
                          Adding brand stamp on page 4
                        </p>
                      </div>
                      <Sparkles className="mt-1 size-5 text-muted-foreground" />
                    </div>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {[
                        "Insert PNG overlay",
                        "Reorder appendix pages",
                        "Apply signature block",
                        "Export reviewed copy",
                      ].map((item) => (
                        <div
                          key={item}
                          className="rounded-2xl border border-border/60 bg-card px-4 py-3 text-sm text-muted-foreground"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-3xl border border-border/60 bg-background/70 p-5">
                      <p className="text-sm text-muted-foreground">
                        Review status
                      </p>
                      <p className="mt-3 text-3xl font-semibold">92%</p>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Layout checks and visual alignment passed.
                      </p>
                    </div>
                    <div className="rounded-3xl bg-primary px-5 py-5 text-primary-foreground">
                      <p className="text-sm text-primary-foreground/80">
                        Export queue
                      </p>
                      <p className="mt-3 text-3xl font-semibold">03</p>
                      <p className="mt-2 text-sm text-primary-foreground/80">
                        Files staged for download and team review.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="border-y border-border/60 bg-card/40">
          <div className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-20 lg:grid-cols-3 lg:px-8">
            {featureCards.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="border-border/60 bg-background/80 shadow-[0_20px_80px_-56px_rgba(0,0,0,0.9)]"
              >
                <CardHeader className="space-y-5">
                  <div className="flex size-12 items-center justify-center rounded-2xl border border-border/70 bg-muted/70">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <CardTitle>{title}</CardTitle>
                    <CardDescription className="text-sm leading-7">
                      {description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto grid w-full max-w-7xl gap-8 px-6 py-20 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div className="space-y-4">
            <Badge className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              Workflow
            </Badge>
            <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
              Built for the full PDF lifecycle, not just one quick edit.
            </h2>
            <p className="max-w-xl text-base leading-8 text-muted-foreground">
              The product flow is simple for users and structured for your
              backend roadmap: upload, edit, review, and download.
            </p>
          </div>
          <div className="grid gap-4">
            {workflowSteps.map((step, index) => (
              <Card
                key={step}
                className="border-border/60 bg-card/70 shadow-[0_16px_60px_-42px_rgba(0,0,0,0.65)]"
              >
                <CardContent className="flex items-start gap-4 p-6">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border/70 bg-background text-sm font-semibold">
                    0{index + 1}
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-semibold tracking-tight">
                      {step}
                    </p>
                    <p className="text-sm leading-7 text-muted-foreground">
                      Designed to support image overlays, annotations, page
                      organization, and final export in one clean flow.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl px-6 pb-24 lg:px-8">
          <Card className="overflow-hidden border-border/60 bg-primary text-primary-foreground shadow-[0_24px_100px_-48px_rgba(0,0,0,0.85)]">
            <CardContent className="grid gap-8 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
              <div className="space-y-4">
                <Badge className="w-fit rounded-full border-primary-foreground/20 bg-primary-foreground/10 px-3 py-1 text-xs uppercase tracking-[0.24em] text-primary-foreground">
                  Ready to build
                </Badge>
                <h2 className="font-display max-w-2xl text-4xl tracking-tight sm:text-5xl">
                  Launch a PDF editing experience that feels credible on day
                  one.
                </h2>
                <div className="flex flex-col gap-3 text-sm text-primary-foreground/80 sm:flex-row sm:gap-6">
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck className="size-4" />
                    Auth-ready
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4" />
                    Drizzle schema included
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Sparkles className="size-4" />
                    Light and dark UI
                  </span>
                </div>
              </div>
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="rounded-full px-6"
              >
                <Link href="/auth/sign-up">Create workspace</Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        <section className="border-y border-border/60 bg-card/30">
          <div className="mx-auto w-full max-w-7xl px-6 py-20 lg:px-8">
            <div className="mb-8 space-y-3">
              <Badge className="rounded-full bg-muted px-3 py-1 text-xs uppercase tracking-[0.24em] text-muted-foreground">
                Teams and outcomes
              </Badge>
              <h2 className="font-display text-4xl tracking-tight sm:text-5xl">
                One editor flow for every PDF-heavy team.
              </h2>
              <p className="max-w-3xl text-base leading-8 text-muted-foreground">
                From fast proposal iteration to compliance-ready exports, keep
                your document operations in one reliable surface.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {useCases.map((item) => (
                <Card
                  key={item.title}
                  className="border-border/60 bg-background/80 shadow-[0_20px_80px_-56px_rgba(0,0,0,0.9)]"
                >
                  <CardHeader className="space-y-3">
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription className="text-sm leading-7">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}

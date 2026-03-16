import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const termsSections = [
  {
    heading: "1. Acceptance of terms",
    points: [
      "By accessing or using Editly, you agree to these Terms & Conditions and any policies linked from this page.",
      "If you use Editly on behalf of a company, you confirm you have authority to bind that organization.",
    ],
  },
  {
    heading: "2. Account responsibilities",
    points: [
      "You are responsible for keeping your sign-in credentials secure and for all actions performed through your account.",
      "You must provide accurate account information and keep your name and email updated.",
      "You must notify support promptly if you suspect unauthorized access.",
    ],
  },
  {
    heading: "3. Acceptable use",
    points: [
      "You may not upload or process content that is unlawful, harmful, infringing, or deceptive.",
      "You may not attempt to disrupt the service, bypass security, or reverse engineer protected platform functionality.",
      "You remain responsible for ensuring your uploaded files and workflow outputs comply with applicable laws and regulations.",
    ],
  },
  {
    heading: "4. Service availability and changes",
    points: [
      "We may improve, change, or discontinue features, limits, or plan configurations at any time.",
      "Temporary downtime may occur for maintenance, updates, or security actions.",
      "We will make reasonable efforts to keep core editing and account features available.",
    ],
  },
  {
    heading: "5. Billing and subscriptions",
    points: [
      "Paid plans are billed according to the pricing terms shown at purchase time.",
      "You are responsible for taxes, billing details, and timely payment for active subscriptions.",
      "If payment fails, we may limit access to paid features until billing is resolved.",
    ],
  },
  {
    heading: "6. Intellectual property",
    points: [
      "You retain ownership of your files and content.",
      "Editly and its interface, branding, and underlying software are protected by applicable intellectual property laws.",
      "No rights are granted except those needed to use the service under these terms.",
    ],
  },
  {
    heading: "7. Termination",
    points: [
      "You may stop using the service at any time.",
      "We may suspend or terminate accounts for violations, abuse, fraud risk, or security concerns.",
      "After termination, access to service features may be removed immediately.",
    ],
  },
  {
    heading: "8. Limitation of liability",
    points: [
      'Editly is provided on an "as available" basis without guarantees of uninterrupted or error-free operation.',
      "To the maximum extent permitted by law, Editly is not liable for indirect, incidental, or consequential damages.",
      "Your sole remedy for dissatisfaction is to stop using the service.",
    ],
  },
  {
    heading: "9. Updates to these terms",
    points: [
      "We may revise these terms to reflect legal, operational, or product changes.",
      "Continued use of Editly after updates become effective means you accept the revised terms.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-14 lg:px-8">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="font-display text-4xl tracking-tight">
              Terms & Conditions
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: March 16, 2026
            </p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm leading-7 text-muted-foreground">
            {termsSections.map((section) => (
              <section key={section.heading} className="space-y-3">
                <h2 className="text-base font-semibold text-foreground">
                  {section.heading}
                </h2>
                <ul className="list-disc space-y-2 pl-5 marker:text-muted-foreground">
                  {section.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </section>
            ))}
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

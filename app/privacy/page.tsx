import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const privacySections = [
  {
    heading: "1. Information we collect",
    points: [
      "Account data: name, email, and authentication-related information required to create and secure your account.",
      "Usage data: interactions with dashboard features, session activity, and product diagnostics used to improve reliability.",
      "Document data: files you upload and edits you apply in order to provide PDF processing and export functionality.",
    ],
  },
  {
    heading: "2. How we use your information",
    points: [
      "To provide core product functions such as sign-in, workspace access, document editing, and file export.",
      "To maintain platform security, detect abuse, and prevent unauthorized activity.",
      "To improve product performance, user experience, and support quality.",
    ],
  },
  {
    heading: "3. Legal basis and consent",
    points: [
      "We process data where necessary to provide the service you request.",
      "Where required, we rely on your consent for optional analytics and similar processing.",
      "You can withdraw optional consent by adjusting browser or account settings where available.",
    ],
  },
  {
    heading: "4. Sharing of information",
    points: [
      "We do not sell personal information.",
      "We may share limited data with trusted service providers who support hosting, authentication, and operations under contractual protections.",
      "We may disclose information when required by law, court order, or valid regulatory request.",
    ],
  },
  {
    heading: "5. Data retention",
    points: [
      "Account information is retained while your account is active and as needed for legal and operational obligations.",
      "Uploaded files and processing metadata may be retained for service continuity, backups, and security logging.",
      "Retention periods may vary by account type, law, and security requirements.",
    ],
  },
  {
    heading: "6. Security measures",
    points: [
      "We use reasonable administrative, technical, and organizational safeguards to protect your data.",
      "No internet-based system is perfectly secure, and you should also protect your account credentials and devices.",
      "If a material security incident occurs, we will follow applicable notification requirements.",
    ],
  },
  {
    heading: "7. Your rights and choices",
    points: [
      "You may request access, correction, export, or deletion of your personal data, subject to legal exceptions.",
      "You may close your account by contacting support.",
      "You can opt out of optional communications using unsubscribe controls when available.",
    ],
  },
  {
    heading: "8. International data transfers",
    points: [
      "If data is transferred across regions, we apply safeguards designed to protect personal information.",
      "By using Editly, you acknowledge processing may occur in locations where our service providers operate.",
    ],
  },
  {
    heading: "9. Policy updates",
    points: [
      "We may update this Privacy Policy to reflect legal, technical, or business changes.",
      "Material updates will be posted on this page with a revised effective date.",
    ],
  },
  {
    heading: "10. Contact",
    points: ["For privacy requests or questions, contact support@editly.app."],
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-14 lg:px-8">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="font-display text-4xl tracking-tight">
              Privacy Policy
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: March 16, 2026
            </p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm leading-7 text-muted-foreground">
            {privacySections.map((section) => (
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

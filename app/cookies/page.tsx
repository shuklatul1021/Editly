import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const cookieSections = [
  {
    heading: "1. What are cookies",
    points: [
      "Cookies are small text files stored on your device to remember preferences and improve site functionality.",
      "Similar technologies (such as local storage) may also be used for session and experience management.",
    ],
  },
  {
    heading: "2. Cookies we use",
    points: [
      "Essential cookies: required for sign-in, authentication security, and core dashboard behavior.",
      "Preference cookies: remember selected interface options such as theme and display preferences.",
      "Analytics cookies: help us understand product usage, performance, and reliability trends.",
    ],
  },
  {
    heading: "3. Why we use cookies",
    points: [
      "To keep you signed in and protect accounts from suspicious activity.",
      "To maintain stable user sessions while you upload, edit, and export PDFs.",
      "To improve speed, usability, and feature quality over time.",
    ],
  },
  {
    heading: "4. Third-party cookies",
    points: [
      "Some service providers may set cookies when supporting hosting, analytics, or platform operations.",
      "These providers are expected to process data according to contractual and legal obligations.",
    ],
  },
  {
    heading: "5. Managing cookie choices",
    points: [
      "You can control or delete cookies through browser settings.",
      "Blocking essential cookies may prevent sign-in, workspace loading, or other core functionality.",
      "You may need to reconfigure preferences after clearing browser data.",
    ],
  },
  {
    heading: "6. Policy updates",
    points: [
      "We may update this Cookie Policy to reflect technology, legal, or service changes.",
      "Updates will be posted on this page with a revised effective date.",
    ],
  },
  {
    heading: "7. Contact",
    points: ["For cookie-related questions, contact support@editly.app."],
  },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-14 lg:px-8">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="font-display text-4xl tracking-tight">
              Cookie Policy
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Last updated: March 16, 2026
            </p>
          </CardHeader>
          <CardContent className="space-y-8 text-sm leading-7 text-muted-foreground">
            {cookieSections.map((section) => (
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

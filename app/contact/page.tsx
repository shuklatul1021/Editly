import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto w-full max-w-4xl px-6 py-14 lg:px-8">
        <Card className="border-border/60 bg-card/70">
          <CardHeader>
            <CardTitle className="font-display text-4xl tracking-tight">
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-sm leading-7 text-muted-foreground">
            <p>
              Need help with account access, billing, or document workflows?
              Reach out to the Editly support team.
            </p>
            <p>
              Email: support@editly.app
              <br />
              Hours: Monday to Friday, 9:00 AM – 6:00 PM
            </p>
            <p>
              For urgent access issues, include your account email and a short
              description of the problem for faster response.
            </p>
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </div>
  );
}

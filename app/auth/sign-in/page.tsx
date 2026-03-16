import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";
import { authOptions } from "@/lib/auth";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Return to your PDF workspace."
      description="Manage uploads, edit pages, add images, and export clean files from one professional dashboard."
      alternateHref="/auth/sign-up"
      alternateLabel="Need an account? Create one"
    >
      <SignInForm />
    </AuthShell>
  );
}

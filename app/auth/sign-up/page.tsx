import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";
import { authOptions } from "@/lib/auth";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <AuthShell
      eyebrow="Create workspace"
      title="Start a refined PDF editing experience."
      description="Create an account to give users a clean way to upload files, make edits, and download final PDFs."
      alternateHref="/auth/sign-in"
      alternateLabel="Already have an account? Sign in"
    >
      <SignUpForm />
    </AuthShell>
  );
}

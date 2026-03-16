import { hash } from "bcryptjs";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { users } from "@/db/schema";
import { db, ensureDatabaseSchema } from "@/lib/db";
import { signUpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { message: "DATABASE_URL is not configured." },
      { status: 503 }
    );
  }

  const body = await request.json();
  const parsedBody = signUpSchema.safeParse(body);

  if (!parsedBody.success) {
    return NextResponse.json(
      {
        message: parsedBody.error.issues[0]?.message ?? "Invalid request body.",
      },
      { status: 400 }
    );
  }

  try {
    await ensureDatabaseSchema();

    const existingUsers = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, parsedBody.data.email))
      .limit(1);

    if (existingUsers.length > 0) {
      return NextResponse.json(
        { message: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await hash(parsedBody.data.password, 10);

    const insertedUsers = await db
      .insert(users)
      .values({
        name: parsedBody.data.name,
        email: parsedBody.data.email,
        password: hashedPassword,
      })
      .returning({ id: users.id });

    return NextResponse.json(
      { success: true, userId: insertedUsers[0]?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup failed", error);

    return NextResponse.json(
      { message: "Unable to create account. Check your database connection." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { SignJWT } from "jose";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const userDatabase: Record<string, { id: string; name: string; email: string; role: string }> = {
  "admin@construct.com": { id: "1", name: "Admin User", email: "admin@construct.com", role: "admin" },
  "john@construct.com": { id: "1", name: "John Smith", email: "john@construct.com", role: "admin" },
  "sarah@arch.com": { id: "2", name: "Sarah Davis", email: "sarah@arch.com", role: "architect" },
  "emma@client.com": { id: "3", name: "Emma Brown", email: "emma@client.com", role: "client" },
  "michael@arch.com": { id: "4", name: "Michael Chen", email: "michael@arch.com", role: "architect" },
  "lisa@client.com": { id: "5", name: "Lisa Johnson", email: "lisa@client.com", role: "client" },
  "client@construct.com": { id: "3", name: "Client User", email: "client@construct.com", role: "client" },
  "manager@construct.com": { id: "6", name: "Manager User", email: "manager@construct.com", role: "manager" },
  "worker@construct.com": { id: "7", name: "Worker User", email: "worker@construct.com", role: "worker" },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    let user = userDatabase[email.toLowerCase()];
    if (!user) {
      const fallbackName = email.split("@")[0].replace(/\./g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      user = { id: "u-" + Date.now(), name: fallbackName, email: email.toLowerCase(), role: "client" };
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "secret-key");
    const token = await new SignJWT({ userId: user.id, email: user.email, role: user.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(secret);

    return NextResponse.json({
      user,
      token,
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }
}
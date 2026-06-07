import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(["admin", "client", "architect"]),
  phone: z.string().optional(),
  specialization: z.string().optional(),
  company: z.string().optional(),
});

let users: any[] = [
  { id: "1", name: "John Smith", email: "john@construct.com", role: "admin", phone: "+1 555-0101", company: "ConstructPro" },
  { id: "2", name: "Sarah Davis", email: "sarah@arch.com", role: "architect", phone: "+1 555-0102", specialization: "Structural" },
  { id: "3", name: "Emma Brown", email: "emma@client.com", role: "client", phone: "+1 555-0103", company: "BuildCorp" },
  { id: "4", name: "Michael Chen", email: "michael@arch.com", role: "architect", phone: "+1 555-0104", specialization: "Civil" },
  { id: "5", name: "Lisa Johnson", email: "lisa@client.com", role: "client", phone: "+1 555-0105" },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const user = userSchema.parse(body);

    const exists = users.some((u) => u.email.toLowerCase() === user.email.toLowerCase());
    if (exists) {
      return NextResponse.json({ message: "User already exists" }, { status: 409 });
    }

    const newUser = {
      id: String(users.length + 1),
      ...user,
    };

    users.push(newUser);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!updates.name && !updates.email && !updates.role && !updates.phone && !updates.specialization && !updates.company) {
      return NextResponse.json({ message: "No valid fields to update" }, { status: 400 });
    }

    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    users[index] = { ...users[index], ...updates };
    return NextResponse.json(users[index]);
  } catch (error) {
    return NextResponse.json({ message: "Invalid user data" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    const index = users.findIndex((u) => u.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    users.splice(index, 1);
    return NextResponse.json({ message: "User deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
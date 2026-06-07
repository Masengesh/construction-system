import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const taskSchema = z.object({
  projectId: z.string(),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["todo", "in-progress", "completed", "blocked"]).optional(),
  priority: z.enum(["low", "medium", "high"]),
  assigneeId: z.string(),
  dueDate: z.string(),
});

let tasks: any[] = [
  { id: "1", projectId: "1", title: "Foundation inspection", status: "completed", priority: "high", assigneeId: "1", dueDate: "2024-01-15" },
  { id: "2", projectId: "1", title: "Steel framework", status: "in-progress", priority: "high", assigneeId: "2", dueDate: "2024-01-20" },
  { id: "3", projectId: "2", title: "Electrical wiring", status: "todo", priority: "medium", assigneeId: "3", dueDate: "2024-01-25" },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const projectId = searchParams.get("projectId");

  if (projectId) {
    return NextResponse.json(tasks.filter(t => t.projectId === projectId));
  }
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = taskSchema.parse(body);

    const newTask = {
      id: String(tasks.length + 1),
      ...task,
      status: "todo",
      assigneeName: "Assigned User",
      createdAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Invalid task data" },
      { status: 400 }
    );
  }
}
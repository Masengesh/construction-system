import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["planning", "active", "on-hold", "completed"]).optional(),
  startDate: z.string(),
  endDate: z.string(),
  budget: z.number(),
  managerId: z.string().optional(),
  clientId: z.string().optional(),
});

let projects: any[] = [
  { id: "1", name: "Downtown Office Tower", description: "15-story commercial building with modern amenities", status: "active", progress: 65, budget: 2400000, spent: 1560000, startDate: "2024-01-15", endDate: "2024-12-31", managerId: "m1", clientId: "3", createdAt: new Date().toISOString() },
  { id: "2", name: "Residential Complex", description: "200-unit apartment complex with parking", status: "active", progress: 30, budget: 1800000, spent: 540000, startDate: "2024-03-01", endDate: "2025-06-30", managerId: "m2", clientId: "3", createdAt: new Date().toISOString() },
  { id: "3", name: "Highway Renovation", description: "Highway expansion and resurfacing", status: "completed", progress: 100, budget: 5000000, spent: 5000000, startDate: "2023-06-01", endDate: "2024-02-28", managerId: "m3", clientId: "5", createdAt: new Date().toISOString() },
];

let materials: any[] = [
  { id: "m1", projectId: "1", name: "Cement", quantity: 500, unit: "bags", cost: 15000, supplier: "BuildMat Co." },
  { id: "m2", projectId: "1", name: "Steel Rods", quantity: 200, unit: "bars", cost: 45000, supplier: "SteelWorks Inc." },
  { id: "m3", projectId: "1", name: "Fine Sand", quantity: 100, unit: "cubic m", cost: 12000, supplier: "BuildMat Co." },
  { id: "m4", projectId: "1", name: "Electrical Cables", quantity: 50, unit: "rolls", cost: 25000, supplier: "ElectriTech" },
  { id: "m5", projectId: "1", name: "Paint Coating", quantity: 80, unit: "litres", cost: 8500, supplier: "ColorPro" },
  { id: "m6", projectId: "2", name: "Cement", quantity: 300, unit: "bags", cost: 9000, supplier: "BuildMat Co." },
  { id: "m7", projectId: "2", name: "Paint", quantity: 100, unit: "cans", cost: 6000, supplier: "ColorPro" },
  { id: "m8", projectId: "2", name: "Bricks", quantity: 5000, unit: "pieces", cost: 12000, supplier: "BrickHouse" },
];

let labours: any[] = [
  { id: "l1", projectId: "1", role: "Site Engineer", workers: 3, hours: 480, rate: 50, totalCost: 72000 },
  { id: "l2", projectId: "1", role: "Skilled Labourer", workers: 10, hours: 480, rate: 25, totalCost: 120000 },
  { id: "l3", projectId: "1", role: "Electrician", workers: 4, hours: 300, rate: 35, totalCost: 42000 },
  { id: "l4", projectId: "1", role: "Safety Inspector", workers: 2, hours: 200, rate: 40, totalCost: 16000 },
  { id: "l5", projectId: "2", role: "Site Engineer", workers: 2, hours: 400, rate: 50, totalCost: 40000 },
  { id: "l6", projectId: "2", role: "Skilled Labourer", workers: 8, hours: 400, rate: 25, totalCost: 80000 },
  { id: "l7", projectId: "2", role: "Architect", workers: 1, hours: 150, rate: 80, totalCost: 12000 },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const clientId = searchParams.get("clientId");
  const projectId = searchParams.get("projectId");
  const type = searchParams.get("type");

  if (type === "materials") {
    const pid = searchParams.get("projectId");
    if (pid) {
      return NextResponse.json(materials.filter((m) => m.projectId === pid));
    }
    return NextResponse.json(materials);
  }

  if (type === "labours") {
    const pid = searchParams.get("projectId");
    if (pid) {
      return NextResponse.json(labours.filter((l) => l.projectId === pid));
    }
    return NextResponse.json(labours);
  }

  if (type === "total-cost") {
    const pid = searchParams.get("projectId");
    if (pid) {
      const matTotal = materials.filter((m) => m.projectId === pid).reduce((sum, m) => sum + m.cost, 0);
      const labTotal = labours.filter((l) => l.projectId === pid).reduce((sum, l) => sum + l.totalCost, 0);
      return NextResponse.json({ projectId: pid, materialsTotal: matTotal, labourTotal: labTotal, grandTotal: matTotal + labTotal });
    }
    return NextResponse.json({ error: "projectId required" }, { status: 400 });
  }

  if (projectId) {
    const project = projects.find((p) => p.id === projectId);
    if (project) {
      const projMaterials = materials.filter((m) => m.projectId === projectId);
      const projLabours = labours.filter((l) => l.projectId === projectId);
      return NextResponse.json({ ...project, materials: projMaterials, labours: projLabours });
    }
    return NextResponse.json({}, { status: 404 });
  }
  if (clientId) {
    return NextResponse.json(projects.filter((p) => p.clientId === clientId));
  }
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const project = projectSchema.parse(body);

    const exists = projects.some(
      (p) =>
        p.name.toLowerCase() === project.name.toLowerCase() &&
        (p.status === project.status || !project.status)
    );
    if (exists) {
      return NextResponse.json({ message: "Project already exists" }, { status: 409 });
    }

    const newProject = {
      id: String(projects.length + 1),
      ...project,
      progress: 0,
      spent: 0,
      createdAt: new Date().toISOString(),
    };

    projects.push(newProject);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid project data" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    projects[index] = { ...projects[index], ...updates };
    return NextResponse.json(projects[index]);
  } catch (error) {
    return NextResponse.json({ message: "Invalid project data" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    projects.splice(index, 1);
    return NextResponse.json({ message: "Project deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

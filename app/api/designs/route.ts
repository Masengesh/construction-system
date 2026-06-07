import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const designSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  category: z.string().min(1),
  price: z.number().nonnegative().optional(),
  architectId: z.string(),
  architectName: z.string().optional(),
  imageUrl: z.string().url().optional(),
  fileUrl: z.string().url().optional(),
});

let designs: any[] = [
  {
    id: "1",
    title: "Modern Villa Concept",
    description: "2-storey modern villa with open plan living",
    category: "Residential",
    price: 1200,
    architectId: "arch1",
    architectName: "John Architect",
    imageUrl: "https://placehold.co/600x400?text=Modern+Villa",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Office Building Layout",
    description: "10-floor commercial office design",
    category: "Commercial",
    price: 2500,
    architectId: "arch2",
    architectName: "Sarah Designer",
    imageUrl: "https://placehold.co/600x400?text=Office+Layout",
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Industrial Warehouse",
    description: "Large-scale warehouse with loading docks",
    category: "Industrial",
    price: 1800,
    architectId: "arch1",
    architectName: "John Architect",
    imageUrl: "https://placehold.co/600x400?text=Warehouse",
    createdAt: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  return NextResponse.json(designs);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const design = designSchema.parse(body);

    const newDesign = {
      id: String(designs.length + 1),
      ...design,
      price: design.price ?? 0,
      createdAt: new Date().toISOString(),
    };

    designs.push(newDesign);
    return NextResponse.json(newDesign, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid design data" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    const index = designs.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    designs[index] = { ...designs[index], ...updates };
    return NextResponse.json(designs[index]);
  } catch (error) {
    return NextResponse.json({ message: "Invalid design data" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    const index = designs.findIndex((d) => d.id === id);
    if (index === -1) {
      return NextResponse.json({ message: "Design not found" }, { status: 404 });
    }

    designs.splice(index, 1);
    return NextResponse.json({ message: "Design deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

import { NextRequest, NextResponse } from "next/server";

let orders: any[] = [];

export async function GET(request: NextRequest) {
  return NextResponse.json(orders);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.designId || !body.clientId || typeof body.total !== "number") {
      return NextResponse.json({ message: "Invalid order data" }, { status: 400 });
    }

    const newOrder = {
      id: String(orders.length + 1),
      ...body,
      status: "completed",
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

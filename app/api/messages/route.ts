import { NextRequest, NextResponse } from "next/server";

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
}

let messages: Message[] = [
  { id: "msg1", senderId: "a1", receiverId: "c1", senderName: "Admin", content: "Welcome! We have started the Downtown Office Tower project. Progress is 65% complete.", read: true, createdAt: "2024-03-15T10:30:00Z" },
  { id: "msg2", senderId: "c1", receiverId: "a1", senderName: "You", content: "Thank you! Could you share the updated timeline?", read: true, createdAt: "2024-03-15T11:00:00Z" },
  { id: "msg3", senderId: "a1", receiverId: "c1", senderName: "Admin", content: "The construction is now on schedule for December completion. Steel framework is 80% done.", read: false, createdAt: "2024-03-16T09:15:00Z" },
  { id: "msg4", senderId: "c1", receiverId: "a1", senderName: "You", content: "Great news. Please send me the latest progress photos when available.", read: true, createdAt: "2024-03-16T10:00:00Z" },
  { id: "msg5", senderId: "a1", receiverId: "c1", senderName: "Admin", content: "Notes: The Residential Complex project has begun foundation work. Budget allocation looks good.", read: false, createdAt: "2024-03-17T14:20:00Z" },
];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const currentUserId = searchParams.get("currentUserId") || "c1";
  const otherUserId = searchParams.get("otherUserId") || "a1";

  const conversation = messages.filter(
    (m) =>
      (m.senderId === currentUserId && m.receiverId === otherUserId) ||
      (m.senderId === otherUserId && m.receiverId === currentUserId)
  );

  return NextResponse.json(conversation.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { senderId, receiverId, senderName, content } = body;

    if (!senderId || !receiverId || !content?.trim()) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newMessage: Message = {
      id: `msg${Date.now()}`,
      senderId,
      receiverId,
      senderName: senderName || "Client",
      content: content.trim(),
      read: false,
      createdAt: new Date().toISOString(),
    };

    messages.push(newMessage);
    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { messageId, read } = body;

    const index = messages.findIndex((m) => m.id === messageId);
    if (index === -1) {
      return NextResponse.json({ message: "Message not found" }, { status: 404 });
    }

    messages[index] = { ...messages[index], read: read ?? true };
    return NextResponse.json(messages[index]);
  } catch (error) {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}

export type Role = "admin" | "client" | "architect" | "manager" | "worker";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  phone?: string;
  specialization?: string;
  company?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: "planning" | "active" | "on-hold" | "completed";
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  progress: number;
  managerId: string;
  clientId?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "completed" | "blocked";
  priority: "low" | "medium" | "high";
  assigneeId: string;
  assigneeName: string;
  dueDate: string;
  createdAt: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Report {
  id: string;
  projectId: string;
  type: "cost" | "progress" | "material" | "labour";
  generatedAt: string;
  data: Record<string, unknown>;
}

export interface Order {
  id: string;
  projectId: string;
  clientId: string;
  items: { name: string; quantity: number; price: number }[];
  total: number;
  status: "pending" | "processing" | "delivered" | "cancelled";
  createdAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
}

export interface Material {
  id: string;
  projectId: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
}

export interface Labour {
  id: string;
  projectId: string;
  role: string;
  workers: number;
  hours: number;
  rate: number;
  totalCost: number;
}
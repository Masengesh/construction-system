"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function WorkerDashboard() {
  const tasks = [
    { id: "1", title: "Foundation work", status: "in-progress", priority: "high", dueDate: "2024-01-20" },
    { id: "2", title: "Concrete mixing", status: "todo", priority: "medium", dueDate: "2024-01-25" },
    { id: "3", title: "Site cleanup", status: "todo", priority: "low", dueDate: "2024-01-18" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-end h-16 px-6 bg-white border-b">
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Worker Portal</span>
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center text-white font-semibold">W</div>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Assigned Tasks</h2>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-medium">{task.title}</p>
                  <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "default"}>
                    {task.priority}
                  </Badge>
                  <Badge variant={task.status === "in-progress" ? "info" : "default"}>
                    {task.status}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
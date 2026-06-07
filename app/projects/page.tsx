import { Sidebar, Header } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import Link from "next/link";

export default function ProjectsPage() {
  const projects = [
    { id: "1", name: "Downtown Office Tower", description: "15-story commercial building", status: "active", progress: 65, budget: "$2.4M", startDate: "2024-01-01", endDate: "2024-12-31" },
    { id: "2", name: "Residential Complex", description: "200-unit apartment complex", status: "active", progress: 30, budget: "$1.8M", startDate: "2024-02-15", endDate: "2025-06-30" },
    { id: "3", name: "Highway Renovation", description: "Main St. to 5th Ave. upgrade", status: "completed", progress: 100, budget: "$5M", startDate: "2023-06-01", endDate: "2023-12-15" },
    { id: "4", name: "Bridge Construction", description: "River crossing bridge", status: "on-hold", progress: 45, budget: "$12M", startDate: "2024-03-01", endDate: "2026-03-01" },
    { id: "5", name: "Shopping Mall", description: "Retail and entertainment complex", status: "planning", progress: 10, budget: "$25M", startDate: "2024-07-01", endDate: "2027-01-01" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "info";
      case "completed": return "success";
      case "on-hold": return "warning";
      case "planning": return "default";
      default: return "default";
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Projects</h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              + New Project
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg">{project.name}</h3>
                  <Badge variant={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-4">{project.description}</p>
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Budget: {project.budget}</span>
                  <span>{project.startDate} - {project.endDate}</span>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
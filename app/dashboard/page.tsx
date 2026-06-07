import { Sidebar, Header } from "@/components/layout/sidebar";
import { Card, StatsCard } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const projects = [
    { id: "1", name: "Downtown Office Tower", progress: 65, status: "active", budget: "$2.4M", spent: "$1.5M" },
    { id: "2", name: "Residential Complex", progress: 30, status: "active", budget: "$1.8M", spent: "$540K" },
    { id: "3", name: "Highway Renovation", progress: 100, status: "completed", budget: "$5M", spent: "$5M" },
  ];

  const recentTasks = [
    { id: "1", title: "Foundation inspection", status: "completed", priority: "high", dueDate: "2024-01-15" },
    { id: "2", title: "Steel framework", status: "in-progress", priority: "high", dueDate: "2024-01-20" },
    { id: "3", title: "Electrical wiring", status: "todo", priority: "medium", dueDate: "2024-01-25" },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard title="Total Projects" value="12" icon="🏗️" trend="up" trendValue="+2 this month" />
            <StatsCard title="Active Tasks" value="48" icon="📋" trend="up" trendValue="+12% from last week" />
            <StatsCard title="Budget Used" value="$8.2M" icon="💰" trend="neutral" trendValue="68% of total" />
            <StatsCard title="Workers On-Site" value="127" icon="👷" trend="up" trendValue="+5 today" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card title="Project Progress">
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">{project.name}</span>
                      <Badge variant={project.status === "active" ? "info" : "success"}>
                        {project.status}
                      </Badge>
                    </div>
                    <ProgressBar value={project.progress} />
                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                      <span>Budget: {project.budget}</span>
                      <span>Spent: {project.spent}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Recent Tasks">
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-gray-600">Due: {task.dueDate}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={task.priority === "high" ? "danger" : task.priority === "medium" ? "warning" : "default"}>
                        {task.priority}
                      </Badge>
                      <Badge variant={task.status === "completed" ? "success" : task.status === "in-progress" ? "info" : "default"}>
                        {task.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
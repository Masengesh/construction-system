import { Sidebar, Header } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function TasksPage() {
  const tasks = [
    { id: "1", title: "Foundation inspection", description: "Complete structural analysis", status: "completed", priority: "high", assignee: "John Smith", dueDate: "2024-01-15", project: "Downtown Office Tower" },
    { id: "2", title: "Steel framework", description: "Install steel beams - floors 1-5", status: "in-progress", priority: "high", assignee: "Mike Johnson", dueDate: "2024-01-20", project: "Downtown Office Tower" },
    { id: "3", title: "Electrical wiring", description: "Main electrical installation", status: "todo", priority: "medium", assignee: "Sarah Davis", dueDate: "2024-01-25", project: "Residential Complex" },
    { id: "4", title: "Concrete pour", description: "Foundation concrete work", status: "blocked", priority: "high", assignee: "Alex Wilson", dueDate: "2024-01-18", project: "Bridge Construction" },
    { id: "5", title: "Permit application", description: "Submit building permits", status: "in-progress", priority: "medium", assignee: "Lisa Chen", dueDate: "2024-01-12", project: "Shopping Mall" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "success";
      case "in-progress": return "info";
      case "blocked": return "warning";
      case "todo": return "default";
      default: return "default";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "danger";
      case "medium": return "warning";
      case "low": return "default";
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
            <h2 className="text-2xl font-bold">Tasks</h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              + New Task
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {["todo", "in-progress", "completed", "blocked"].map((status) => (
              <div key={status} className="bg-gray-100 rounded-lg p-4">
                <h3 className="font-semibold mb-4 capitalize">{status.replace("-", " ")}</h3>
                <div className="space-y-3">
                  {tasks
                    .filter((task) => task.status === status)
                    .map((task) => (
                      <Card key={task.id} className="hover:shadow-md transition-shadow">
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex justify-between items-center mt-3">
                          <span className="text-xs text-gray-500">{task.assignee}</span>
                          <Badge variant={getPriorityColor(task.priority)} size="sm">
                            {task.priority}
                          </Badge>
                        </div>
                        <div className="mt-2 text-xs text-gray-500">{task.project}</div>
                        <div className="mt-1 text-xs text-gray-500">Due: {task.dueDate}</div>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
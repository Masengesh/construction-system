import { Sidebar, Header } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function UsersPage() {
  const users = [
    { id: "1", name: "John Smith", email: "john@construct.com", role: "manager", avatar: "👷‍♂️" },
    { id: "2", name: "Mike Johnson", email: "mike@construct.com", role: "worker", avatar: "👷" },
    { id: "3", name: "Sarah Davis", email: "sarah@construct.com", role: "worker", avatar: "👷‍♀️" },
    { id: "4", name: "Lisa Chen", email: "lisa@construct.com", role: "admin", avatar: "👩‍💼" },
    { id: "5", name: "Alex Wilson", email: "alex@construct.com", role: "worker", avatar: "👷" },
    { id: "6", name: "Emma Brown", email: "emma@client.com", role: "client", avatar: "👤" },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin": return "danger";
      case "manager": return "info";
      case "worker": return "success";
      case "client": return "warning";
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
            <h2 className="text-2xl font-bold">Users</h2>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              + Add User
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <Card key={user.id}>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-2xl">
                    {user.avatar}
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-gray-600">{user.email}</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end">
                  <Badge variant={getRoleColor(user.role)}>
                    {user.role}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}
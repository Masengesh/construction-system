"use client";

import { useEffect, useState } from "react";
import { Sidebar, Header } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tab = "dashboard" | "projects" | "users" | "reports" | "messages";

interface Project {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  endDate: string;
  clientId?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  specialization?: string;
  company?: string;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [projects, setProjects] = useState<Project[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: "",
    description: "",
    status: "planning",
    startDate: "",
    endDate: "",
    budget: 0,
    clientId: "",
  });
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);

  // User form state
  const [userForm, setUserForm] = useState({
    name: "",
    email: "",
    role: "client",
    phone: "",
    specialization: "",
    company: "",
  });
  const [editingUserId, setEditingUserId] = useState<string | null>(null);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<{ id: string; from: string; content: string; time: string }[]>([]);

  const fetchProjects = async () => {
    setLoading(true);
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
    setLoading(false);
  };

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch("/api/users");
    const data = await res.json();
    setUsers(data);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "projects") fetchProjects();
    if (activeTab === "users") fetchUsers();
  }, [activeTab]);

  const handleSaveProject = async () => {
    const url = editingProjectId ? "/api/projects" : "/api/projects";
    const method = editingProjectId ? "PUT" : "POST";

    const body: any = { ...projectForm, budget: Number(projectForm.budget), managerId: "admin" };
    if (editingProjectId) body.id = editingProjectId;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditingProjectId(null);
      setProjectForm({ name: "", description: "", status: "planning", startDate: "", endDate: "", budget: 0, clientId: "" });
      fetchProjects();
    }
  };

  const handleDeleteProject = async (id: string) => {
    await fetch("/api/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchProjects();
  };

  const handleSaveUser = async () => {
    const url = editingUserId ? "/api/users" : "/api/users";
    const method = editingUserId ? "PUT" : "POST";

    const body: any = { ...userForm };
    if (editingUserId) body.id = editingUserId;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditingUserId(null);
      setUserForm({ name: "", email: "", role: "client", phone: "", specialization: "", company: "" });
      fetchUsers();
    }
  };

  const handleDeleteUser = async (id: string) => {
    await fetch("/api/users", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchUsers();
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    const newMsg = {
      id: String(messages.length + 1),
      from: "Admin",
      content: message,
      time: new Date().toISOString(),
    };
    setMessages([...messages, newMsg]);
    setMessage("");
  };

  const totalRevenue = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const totalClients = users.filter((u) => u.role === "client").length;
  const totalArchitects = users.filter((u) => u.role === "architect").length;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "dashboard", label: "Dashboard", icon: "📊" },
    { key: "projects", label: "Projects", icon: "🏗️" },
    { key: "users", label: "Users", icon: "👥" },
    { key: "reports", label: "Reports", icon: "📈" },
    { key: "messages", label: "Messages", icon: "💬" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-3xl font-bold">{projects.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{activeProjects} active</p>
                  </div>
                  <div className="text-3xl">🏗️</div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-3xl font-bold">{users.length}</p>
                    <p className="text-xs text-gray-500 mt-1">{totalClients} clients, {totalArchitects} architects</p>
                  </div>
                  <div className="text-3xl">👥</div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-3xl font-bold">${(totalRevenue / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500 mt-1">Budget across all projects</p>
                  </div>
                  <div className="text-3xl">💰</div>
                </div>
              </Card>
              <Card>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Spent</p>
                    <p className="text-3xl font-bold">${(totalSpent / 1000000).toFixed(1)}M</p>
                    <p className="text-xs text-gray-500 mt-1">{((totalSpent / totalRevenue) * 100).toFixed(0)}% of budget</p>
                  </div>
                  <div className="text-3xl">💸</div>
                </div>
              </Card>
            </div>

            <Card title="Recent Projects">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Project</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Budget</th>
                      <th className="text-right py-2">Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.slice(0, 5).map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3"><Badge variant={p.status === "active" ? "info" : p.status === "completed" ? "success" : "default"}>{p.status}</Badge></td>
                        <td className="py-3 text-right">${p.budget.toLocaleString()}</td>
                        <td className="py-3 text-right">{p.progress}%</td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr><td colSpan={4} className="py-4 text-center text-gray-500">No projects yet</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case "projects":
        return (
          <div className="space-y-6">
            <Card title="Create / Edit Project">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Project name"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Description"
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
                <select
                  className="border rounded-lg px-3 py-2"
                  value={projectForm.status}
                  onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
                <input
                  type="number"
                  className="border rounded-lg px-3 py-2"
                  placeholder="Budget"
                  value={projectForm.budget || ""}
                  onChange={(e) => setProjectForm({ ...projectForm, budget: Number(e.target.value) || 0 })}
                />
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2"
                  value={projectForm.startDate}
                  onChange={(e) => setProjectForm({ ...projectForm, startDate: e.target.value })}
                />
                <input
                  type="date"
                  className="border rounded-lg px-3 py-2"
                  value={projectForm.endDate}
                  onChange={(e) => setProjectForm({ ...projectForm, endDate: e.target.value })}
                />
                <select
                  className="border rounded-lg px-3 py-2"
                  value={projectForm.clientId}
                  onChange={(e) => setProjectForm({ ...projectForm, clientId: e.target.value })}
                >
                  <option value="">Assign Client (optional)</option>
                  {users.filter((u) => u.role === "client").map((u) => (
                    <option key={u.id} value={u.id}>{u.name}</option>
                  ))}
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProject}
                    className="px-4 py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingProjectId ? "Update" : "Create"} Project
                  </button>
                  {editingProjectId && (
                    <button
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({ name: "", description: "", status: "planning", startDate: "", endDate: "", budget: 0, clientId: "" });
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </Card>

            <Card title="All Projects">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Status</th>
                      <th className="text-right py-2">Budget</th>
                      <th className="text-right py-2">Progress</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projects.map((p) => (
                      <tr key={p.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{p.name}</td>
                        <td className="py-3"><Badge variant={p.status === "active" ? "info" : p.status === "completed" ? "success" : "default"}>{p.status}</Badge></td>
                        <td className="py-3 text-right">${p.budget.toLocaleString()}</td>
                        <td className="py-3 text-right">{p.progress}%</td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingProjectId(p.id);
                              setProjectForm({
                                name: p.name,
                                description: p.description,
                                status: p.status,
                                startDate: p.startDate,
                                endDate: p.endDate,
                                budget: p.budget,
                                clientId: p.clientId || "",
                              });
                            }}
                            className="text-primary-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteProject(p.id)} className="text-construction-red hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {projects.length === 0 && (
                      <tr><td colSpan={5} className="py-4 text-center text-gray-500">No projects found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case "users":
        return (
          <div className="space-y-6">
            <Card title="Add / Edit User">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Full name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                />
                <select
                  className="border rounded-lg px-3 py-2"
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value })}
                >
                  <option value="admin">Admin</option>
                  <option value="client">Client</option>
                  <option value="architect">Architect</option>
                </select>
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Phone (optional)"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Specialization (architects)"
                  value={userForm.specialization}
                  onChange={(e) => setUserForm({ ...userForm, specialization: e.target.value })}
                />
                <input
                  className="border rounded-lg px-3 py-2"
                  placeholder="Company (optional)"
                  value={userForm.company}
                  onChange={(e) => setUserForm({ ...userForm, company: e.target.value })}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveUser}
                    className="px-4 py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700"
                  >
                    {editingUserId ? "Update" : "Add"} User
                  </button>
                  {editingUserId && (
                    <button
                      onClick={() => {
                        setEditingUserId(null);
                        setUserForm({ name: "", email: "", role: "client", phone: "", specialization: "", company: "" });
                      }}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>
            </Card>

            <Card title="All Users">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Name</th>
                      <th className="text-left py-2">Email</th>
                      <th className="text-left py-2">Role</th>
                      <th className="text-right py-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id} className="border-b last:border-0">
                        <td className="py-3 font-medium">{u.name}</td>
                        <td className="py-3">{u.email}</td>
                        <td className="py-3"><Badge variant={u.role === "admin" ? "danger" : u.role === "architect" ? "info" : "default"}>{u.role}</Badge></td>
                        <td className="py-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingUserId(u.id);
                              setUserForm({
                                name: u.name,
                                email: u.email,
                                role: u.role,
                                phone: u.phone || "",
                                specialization: u.specialization || "",
                                company: u.company || "",
                              });
                            }}
                            className="text-primary-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button onClick={() => handleDeleteUser(u.id)} className="text-construction-red hover:underline">
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                    {users.length === 0 && (
                      <tr><td colSpan={4} className="py-4 text-center text-gray-500">No users found</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        );

      case "reports":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card title="Total Budget">
                <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Across {projects.length} projects</p>
              </Card>
              <Card title="Total Spent">
                <p className="text-3xl font-bold">${totalSpent.toLocaleString()}</p>
                <p className="text-sm text-gray-600">{((totalSpent / totalRevenue) * 100).toFixed(1)}% utilized</p>
              </Card>
              <Card title="Remaining Budget">
                <p className="text-3xl font-bold">${(totalRevenue - totalSpent).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Available funds</p>
              </Card>
            </div>

            <Card title="Cost Breakdown (Materials + Labour)">
              <div className="space-y-4">
                {projects.map((p) => (
                  <div key={p.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold">{p.name}</h4>
                      <span className="text-sm text-gray-600">{p.status}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Total Budget</p>
                        <p className="font-semibold">${p.budget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Materials</p>
                        <p className="font-semibold">${(p.spent * 0.6).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Labour</p>
                        <p className="font-semibold">${(p.spent * 0.4).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-construction-blue h-2 rounded-full"
                          style={{ width: `${p.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {projects.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No projects to report</p>
                )}
              </div>
            </Card>

            <Card title="Export Reports">
              <div className="flex gap-4">
                <button className="px-4 py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700">
                  Export as PDF
                </button>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">Export as Excel</button>
              </div>
            </Card>
          </div>
        );

      case "messages":
        return (
          <div className="space-y-6">
            <Card title="Messages">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-4">
                  {messages.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No messages yet. Start a conversation below.</p>
                  )}
                  {messages.map((m) => (
                    <div key={m.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-sm">{m.from}</span>
                        <span className="text-xs text-gray-500">{new Date(m.time).toLocaleString()}</span>
                      </div>
                      <p className="text-sm text-gray-800">{m.content}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      className="flex-1 border rounded-lg px-3 py-2"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-4 py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700"
                    >
                      Send
                    </button>
                  </div>
                </div>
                <Card title="Contacts">
                  <div className="space-y-3">
                    {users.slice(0, 5).map((u) => (
                      <div key={u.id} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center text-xs font-semibold text-primary-700">
                          {u.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{u.name}</p>
                          <p className="text-xs text-gray-500">{u.role}</p>
                        </div>
                      </div>
                    ))}
                    {users.length === 0 && <p className="text-gray-500 text-sm">No users</p>}
                  </div>
                </Card>
              </div>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={tabs.find((t) => t.key === activeTab)?.label || "Admin Panel"} />
        <div className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
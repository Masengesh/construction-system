"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Search, Filter } from "lucide-react";

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
}

type StatusFilter = "all" | "active" | "completed" | "on-hold" | "planning";

export default function ClientProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const getClientId = () => {
    try {
      const stored = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (stored) return JSON.parse(stored).id;
    } catch {}
    return "3";
  };
  const clientId = getClientId();

  useEffect(() => {
    fetch(`/api/projects?clientId=${clientId}`)
      .then((res) => res.json())
      .then((data) => { setProjects(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "info";
      case "completed": return "success";
      case "on-hold": return "warning";
      case "planning": return "default";
      default: return "default";
    }
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Projects</h1>
          <p className="text-gray-600 mt-1">All projects assigned to you ({projects.length} total)</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-64"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none bg-white cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on-hold">On Hold</option>
              <option value="planning">Planning</option>
            </select>
          </div>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🏗️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">
              {searchQuery || statusFilter !== "all" ? "Try adjusting your search or filter criteria." : "You don't have any projects assigned yet. Contact the admin to get started."}
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => {
            const budgetUtilization = project.budget ? Math.round((project.spent / project.budget) * 100) : 0;
            return (
              <Card key={project.id} className="hover:shadow-lg transition-all duration-200 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-gray-900 leading-tight pr-2">{project.name}</h3>
                  <Badge variant={getStatusVariant(project.status)}>{project.status}</Badge>
                </div>

                <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-2">
                  {project.description || "No description provided for this project."}
                </p>

                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-semibold text-gray-900">{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} color={project.progress >= 100 ? "green" : project.progress >= 50 ? "blue" : "orange"} />
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-sky-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-0.5">Budget</p>
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(project.budget)}</p>
                  </div>
                  <div className="bg-emerald-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-0.5">Spent</p>
                    <p className="font-bold text-gray-900 text-sm">{formatCurrency(project.spent)}</p>
                    <p className="text-xs text-gray-500">{budgetUtilization}% used</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-500 mb-4 px-1">
                  <div className="flex items-center gap-1">
                    <span className="text-gray-400">📅</span>
                    <span>{formatDate(project.startDate)}</span>
                  </div>
                  <span className="text-gray-400 mx-2">→</span>
                  <div className="flex items-center gap-1">
                    <span>{formatDate(project.endDate)}</span>
                    <span className="text-gray-400">📅</span>
                  </div>
                </div>

                <Link
                  href={`/client/projects/${project.id}`}
                  className="block w-full py-2.5 text-center border border-gray-300 rounded-lg hover:bg-primary-50 hover:border-primary-300 text-sm font-medium text-gray-700 hover:text-primary-700 transition-colors"
                >
                  View Details
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

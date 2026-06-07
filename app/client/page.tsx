"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, StatsCard } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";

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

export default function ClientDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

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

  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);
  const totalSpent = projects.reduce((sum, p) => sum + (p.spent || 0), 0);
  const activeProjects = projects.filter((p) => p.status === "active").length;
  const completedProjects = projects.filter((p) => p.status === "completed").length;
  const avgProgress = projects.length
    ? Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / projects.length)
    : 0;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "active": return "info";
      case "completed": return "success";
      case "on-hold": return "warning";
      case "planning": return "default";
      default: return "default";
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600 mt-1">Welcome back! Here&apos;s your construction portfolio summary.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Projects" value={projects.length} icon="🏗️" trend="up" trendValue={`${activeProjects} active`} />
        <StatsCard title="Total Budget" value={`$${(totalBudget / 1000000).toFixed(1)}M`} icon="💰" trend="neutral" trendValue="All projects" />
        <StatsCard title="Total Spent" value={`$${(totalSpent / 1000000).toFixed(1)}M`} icon="💸" trend={totalSpent > totalBudget ? "down" : "neutral"} trendValue={`${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}% utilized`} />
        <StatsCard title="Avg Progress" value={`${avgProgress}%`} icon="📈" trend="up" trendValue={`${completedProjects} completed`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Project Status Breakdown" className="lg:col-span-1">
          <div className="space-y-4">
            {["active", "completed", "on-hold", "planning"].map((status) => {
              const count = projects.filter((p) => p.status === status).length;
              const pct = projects.length ? Math.round((count / projects.length) * 100) : 0;
              return (
                <div key={status}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium text-gray-700">{status}</span>
                    <span className="text-gray-500">{count} project{count !== 1 ? "s" : ""} ({pct}%)</span>
                  </div>
                  <ProgressBar value={pct} color={status === "completed" ? "green" : status === "active" ? "blue" : "orange"} />
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Recent Projects" className="lg:col-span-2">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-gray-500">
                  <th className="text-left py-3 font-medium">Project</th>
                  <th className="text-left py-3 font-medium">Status</th>
                  <th className="text-left py-3 font-medium">Timeline</th>
                  <th className="text-right py-3 font-medium">Budget</th>
                  <th className="text-right py-3 font-medium">Spent</th>
                  <th className="text-right py-3 font-medium">Progress</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-3">
                      <Link href={`/client/projects/${p.id}`} className="font-medium text-primary-600 hover:text-primary-700 hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="py-3"><Badge variant={getStatusVariant(p.status)}>{p.status}</Badge></td>
                    <td className="py-3 text-gray-600">
                      <div className="text-xs">{formatDate(p.startDate)}</div>
                      <div className="text-xs text-gray-400">to {formatDate(p.endDate)}</div>
                    </td>
                    <td className="py-3 text-right font-medium">${(p.budget || 0).toLocaleString()}</td>
                    <td className="py-3 text-right">${(p.spent || 0).toLocaleString()}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="font-medium w-10 text-right">{p.progress}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-gray-500">No projects assigned yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { ArrowLeft, Calendar, DollarSign, Package, Wrench } from "lucide-react";

interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  cost: number;
  supplier?: string;
}

interface Labour {
  id: string;
  role: string;
  workers: number;
  hours: number;
  rate: number;
  totalCost: number;
}

interface ProjectDetail {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  spent: number;
  progress: number;
  startDate: string;
  endDate: string;
  materials: Material[];
  labours: Labour[];
}

function getStatusVariant(status: string) {
  switch (status) {
    case "active": return "info";
    case "completed": return "success";
    case "on-hold": return "warning";
    case "planning": return "default";
    default: return "default";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;
  const [project, setProject] = useState<ProjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/projects?projectId=${projectId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        if (!data.id) throw new Error("Not found");
        setProject(data);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-primary-200 border-t-primary-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="text-center py-20">
        <div className="text-5xl mb-4">❌</div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Project Not Found</h2>
        <p className="text-gray-600 mb-6">The project you&apos;re looking for doesn&apos;t exist or you don&apos;t have access.</p>
        <Link href="/client/projects" className="text-primary-600 hover:text-primary-700 font-medium hover:underline">← Back to Projects</Link>
      </div>
    );
  }

  const materialsTotal = project.materials.reduce((sum, m) => sum + m.cost, 0);
  const labourTotal = project.labours.reduce((sum, l) => sum + l.totalCost, 0);
  const grandTotal = materialsTotal + labourTotal;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/client/projects"
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-1" />
          <span className="text-sm font-medium">Back to Projects</span>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{project.name}</h1>
          <p className="text-gray-600 mt-1">{project.description || "No description available."}</p>
        </div>
        <Badge variant={getStatusVariant(project.status)} className="text-sm px-4 py-1.5 w-fit">
          {project.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-xl font-bold text-gray-900">{formatCurrency(project.spent)}</p>
              {project.budget > 0 && (
                <p className="text-xs text-gray-500">{Math.round((project.spent / project.budget) * 100)}% of budget</p>
              )}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Timeline</p>
              <p className="text-sm font-medium text-gray-900">
                {formatDate(project.startDate)} — {formatDate(project.endDate)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Project Progress">
        <div className="space-y-3">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-700 font-medium">Overall Completion</span>
            <span className="font-bold text-lg text-primary-600">{project.progress}%</span>
          </div>
          <ProgressBar value={project.progress} color={project.progress >= 100 ? "green" : project.progress >= 50 ? "blue" : "orange"} />
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>Started: {formatDate(project.startDate)}</span>
            <span>Target: {formatDate(project.endDate)}</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Materials Used" className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2.5 px-3 font-medium text-gray-700">Material</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-700">Qty</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-700">Cost</th>
                  <th className="text-left py-2.5 px-3 font-medium text-gray-700">Supplier</th>
                </tr>
              </thead>
              <tbody>
                {project.materials.map((material) => (
                  <tr key={material.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium">{material.name}</td>
                    <td className="py-2.5 px-3 text-right">{material.quantity} {material.unit}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(material.cost)}</td>
                    <td className="py-2.5 px-3 text-gray-600">{material.supplier || "N/A"}</td>
                  </tr>
                ))}
                {project.materials.length === 0 && (
                  <tr><td colSpan={4} className="py-4 text-center text-gray-500">No materials recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Materials</p>
              <p className="text-lg font-bold text-primary-600">{formatCurrency(materialsTotal)}</p>
            </div>
          </div>
        </Card>

        <Card title="Labour Costs">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left py-2.5 px-3 font-medium text-gray-700">Role</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-700">Workers</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-700">Hours</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-700">Rate/hr</th>
                  <th className="text-right py-2.5 px-3 font-medium text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {project.labours.map((labour) => (
                  <tr key={labour.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="py-2.5 px-3 font-medium">{labour.role}</td>
                    <td className="py-2.5 px-3 text-right">{labour.workers}</td>
                    <td className="py-2.5 px-3 text-right">{labour.hours}</td>
                    <td className="py-2.5 px-3 text-right">{formatCurrency(labour.rate)}</td>
                    <td className="py-2.5 px-3 text-right font-medium">{formatCurrency(labour.totalCost)}</td>
                  </tr>
                ))}
                {project.labours.length === 0 && (
                  <tr><td colSpan={5} className="py-4 text-center text-gray-500">No labour costs recorded</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="mt-4 pt-3 border-t flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Labour</p>
              <p className="text-lg font-bold text-emerald-600">{formatCurrency(labourTotal)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Cost Summary">
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Materials Cost</span>
            <span className="font-semibold">{formatCurrency(materialsTotal)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-700">Labour Cost</span>
            <span className="font-semibold">{formatCurrency(labourTotal)}</span>
          </div>
          <div className="flex justify-between items-center py-2 bg-primary-50 rounded-lg px-4">
            <span className="font-bold text-gray-900">Grand Total</span>
            <span className="font-bold text-xl text-primary-600">{formatCurrency(grandTotal)}</span>
          </div>
          <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
            <Package className="w-3 h-3" />
            <span>Materials: {project.materials.length} items</span>
            <span className="mx-2">•</span>
            <Wrench className="w-3 h-3" />
            <span>Labour: {project.labours.length} roles</span>
          </div>
        </div>
      </Card>
    </div>
  );
}

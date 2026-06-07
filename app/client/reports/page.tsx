"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Download, FileText, Table2, TrendingUp } from "lucide-react";

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

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatDate(dateStr: string) {
  if (!dateStr) return "N/A";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
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

export default function ClientReportsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

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
  const totalRemaining = totalBudget - totalSpent;
  const activeProjects = projects.filter((p) => p.status === "active").length;

  const handleDownloadPDF = async () => {
    setExporting(true);
    try {
      const { jsPDF } = await import("jspdf");
      const autoTable = (await import("jspdf-autotable")).default;
      const doc = new jsPDF();

      doc.setFontSize(20);
      doc.setTextColor(15, 23, 42);
      doc.text("Construction Project Report", 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100, 116, 139);
      doc.text(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`, 14, 28);
      doc.text(`Client: c1 | Projects: ${projects.length}`, 14, 34);

      autoTable(doc, {
        startY: 40,
        head: [["Project", "Status", "Budget", "Spent", "Progress", "Timeline"]],
        body: projects.map((p) => [
          p.name,
          p.status,
          formatCurrency(p.budget),
          formatCurrency(p.spent),
          `${p.progress}%`,
          `${formatDate(p.startDate)} - ${formatDate(p.endDate)}`,
        ]),
        headStyles: { fillColor: [14, 165, 233], textColor: 255, fontSize: 9 },
        bodyStyles: { fontSize: 9 },
        alternateRowStyles: { fillColor: [248, 250, 252] },
      });

      autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 15,
        head: [["Cost Breakdown", "Amount"]],
        body: [
          ["Total Budget", formatCurrency(totalBudget)],
          ["Total Spent", formatCurrency(totalSpent)],
          ["Remaining Budget", formatCurrency(totalRemaining)],
          ["Budget Utilization", `${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}%`],
        ],
        headStyles: { fillColor: [14, 165, 233], textColor: 255, fontSize: 10 },
        bodyStyles: { fontSize: 10 },
      });

      doc.save("client-project-report.pdf");
    } catch (err) {
      console.error("PDF export failed:", err);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownloadExcel = async () => {
    setExporting(true);
    try {
      const xlsx = await import("xlsx");
      const wsData = [
        ["Construction Project Report"],
        [`Generated: ${new Date().toLocaleString()}`],
        [`Client ID: c1 | Total Projects: ${projects.length}`],
        [],
        ["Project", "Status", "Budget", "Spent", "Remaining", "Progress", "Start Date", "End Date"],
        ...projects.map((p) => [
          p.name,
          p.status,
          p.budget,
          p.spent,
          p.budget - p.spent,
          `${p.progress}%`,
          p.startDate,
          p.endDate,
        ]),
        [],
        ["Cost Summary"],
        ["Total Budget", totalBudget],
        ["Total Spent", totalSpent],
        ["Remaining Budget", totalRemaining],
        ["Budget Utilization", `${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}%`],
      ];

      const ws = xlsx.utils.aoa_to_sheet(wsData);
      ws["!cols"] = [
        { wch: 30 }, { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
        { wch: 12 }, { wch: 14 }, { wch: 14 },
      ];

      const wb = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(wb, ws, "Projects");
      xlsx.writeFile(wb, "client-project-report.xlsx");
    } catch (err) {
      console.error("Excel export failed:", err);
      alert("Failed to generate Excel. Please try again.");
    } finally {
      setExporting(false);
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
          <p className="text-gray-600 mt-1">Download reports for your projects</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold">{projects.length}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">💰</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Budget</p>
              <p className="text-2xl font-bold">{formatCurrency(totalBudget)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">💸</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Spent</p>
              <p className="text-2xl font-bold">{formatCurrency(totalSpent)}</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <span className="text-xl">📊</span>
            </div>
            <div>
              <p className="text-sm text-gray-600">Budget Left</p>
              <p className="text-2xl font-bold">{formatCurrency(totalRemaining)}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card title="Cost Breakdown by Project">
        <div className="space-y-4">
          {projects.map((p) => (
            <div key={p.id} className="border rounded-lg p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="font-semibold text-gray-900">{p.name}</h4>
                  <Badge variant={getStatusVariant(p.status)}>{p.status}</Badge>
                </div>
                <span className="text-xs text-gray-500">{activeProjects} active</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Budget</p>
                  <p className="font-bold">{formatCurrency(p.budget)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Spent</p>
                  <p className="font-bold">{formatCurrency(p.spent)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Remaining</p>
                  <p className="font-bold text-emerald-600">{formatCurrency(p.budget - p.spent)}</p>
                </div>
                <div>
                  <p className="text-gray-600">Progress</p>
                  <p className="font-bold">{p.progress}%</p>
                </div>
              </div>
              <div className="mt-3">
                <ProgressBar value={p.progress} color={p.progress >= 100 ? "green" : "blue"} />
              </div>
            </div>
          ))}
          {projects.length === 0 && (
            <p className="text-gray-500 text-center py-8">No projects to report on.</p>
          )}
        </div>
      </Card>

      <Card title="Export Reports">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleDownloadPDF}
            disabled={exporting || projects.length === 0}
            className="flex items-center justify-center gap-3 px-6 py-4 bg-construction-blue text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            ) : (
              <FileText className="w-5 h-5" />
            )}
            <span>Download PDF Report</span>
          </button>
          <button
            onClick={handleDownloadExcel}
            disabled={exporting || projects.length === 0}
            className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
          >
            {exporting ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
            ) : (
              <Table2 className="w-5 h-5" />
            )}
            <span>Download Excel Report</span>
          </button>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Sidebar, Header } from "@/components/layout/sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Tab = "overview" | "designs" | "marketplace" | "profile";

interface Design {
  id: string;
  title: string;
  description?: string;
  category: string;
  price: number;
  architectId: string;
  architectName?: string;
  imageUrl?: string;
  createdAt: string;
}

export default function ArchitectDashboard() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [designs, setDesigns] = useState<Design[]>([]);
  const [marketplace, setMarketplace] = useState<Design[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Residential");
  const [price, setPrice] = useState(0);
  const [imageUrl, setImageUrl] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const mockArchitectId = "arch1";

  const fetchDesigns = async () => {
    setLoading(true);
    const res = await fetch("/api/designs");
    const data: Design[] = await res.json();
    const myDesigns = data.filter((d) => d.architectId === mockArchitectId);
    const others = data.filter((d) => d.architectId !== mockArchitectId);
    setDesigns(myDesigns);
    setMarketplace(others);
    setLoading(false);
  };

  useEffect(() => {
    if (activeTab === "designs" || activeTab === "marketplace" || activeTab === "overview") {
      fetchDesigns();
    }
  }, [activeTab]);

  const handleSaveDesign = async () => {
    const body: any = {
      title,
      description,
      category,
      price,
      architectId: mockArchitectId,
      architectName: "Current Architect",
      imageUrl: imageUrl || undefined,
    };

    if (editingId) {
      body.id = editingId;
      const res = await fetch("/api/designs", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setEditingId(null);
        resetForm();
        fetchDesigns();
      }
    } else {
      const res = await fetch("/api/designs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        resetForm();
        fetchDesigns();
      }
    }
  };

  const handleDeleteDesign = async (id: string) => {
    const res = await fetch("/api/designs", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) fetchDesigns();
  };

  const handlePurchaseDesign = async (design: Design) => {
    await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        designId: design.id,
        clientId: "mock_client_1",
        total: design.price,
      }),
    });
    alert("Design purchased!");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setCategory("Residential");
    setPrice(0);
    setImageUrl("");
  };

  const startEdit = (design: Design) => {
    setEditingId(design.id);
    setTitle(design.title);
    setDescription(design.description || "");
    setCategory(design.category);
    setPrice(design.price);
    setImageUrl(design.imageUrl || "");
  };

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview", label: "Overview", icon: "📊" },
    { key: "designs", label: "My Designs", icon: "📐" },
    { key: "marketplace", label: "Marketplace", icon: "🛒" },
    { key: "profile", label: "Profile", icon: "👤" },
  ];

  const totalListings = designs.length;
  const totalRevenue = designs.reduce((sum, d) => sum + d.price, 0);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="architect" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={tabs.find((t) => t.key === activeTab)?.label || "Architect Dashboard"} user={{ name: "John Architect", role: "Architect" }} />
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">My Designs</p>
                      <p className="text-3xl font-bold">{totalListings}</p>
                    </div>
                    <div className="text-3xl">📐</div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Listed Price Total</p>
                      <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
                    </div>
                    <div className="text-3xl">💰</div>
                  </div>
                </Card>
                <Card>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Portfolio Views</p>
                      <p className="text-3xl font-bold">--</p>
                    </div>
                    <div className="text-3xl">👁️</div>
                  </div>
                </Card>
              </div>

              <Card title="Recent Designs">
                {designs.length === 0 ? (
                  <p className="text-gray-500">No designs uploaded yet.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {designs.slice(0, 3).map((d) => (
                      <div key={d.id} className="border rounded-lg p-3">
                        <div className="bg-gray-100 h-32 rounded mb-3 flex items-center justify-center text-gray-500">
                          {d.imageUrl ? <img src={d.imageUrl} alt={d.title} className="h-full w-full object-cover rounded" /> : "No preview"}
                        </div>
                        <h4 className="font-semibold">{d.title}</h4>
                        <p className="text-sm text-gray-600">{d.category}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {activeTab === "designs" && (
            <div className="space-y-6">
              <Card title={editingId ? "Edit Design" : "Upload New Design"}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Design title"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select className="w-full border rounded-lg px-3 py-2" value={category} onChange={(e) => setCategory(e.target.value)}>
                      <option value="Residential">Residential</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Industrial">Industrial</option>
                      <option value="Interior">Interior</option>
                      <option value="Landscape">Landscape</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD)</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (Image / PDF)</label>
                    <input
                      className="w-full border rounded-lg px-3 py-2"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://...png / .pdf"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      className="w-full border rounded-lg px-3 py-2"
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  {(imageUrl || !editingId) && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                      <div className="border rounded-lg p-4 bg-gray-50">
                        {imageUrl ? (
                          imageUrl.toLowerCase().endsWith(".pdf") ? (
                            <div className="flex items-center gap-3 text-gray-700">
                              <span className="text-2xl">📄</span>
                              <span>{imageUrl}</span>
                            </div>
                          ) : (
                            <img src={imageUrl} alt="Preview" className="max-h-48 rounded" />
                          )
                        ) : (
                          <div className="h-32 bg-white border rounded flex items-center justify-center text-gray-500">
                            Upload a file or paste an image URL
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="md:col-span-2 flex gap-2">
                    <button
                      onClick={handleSaveDesign}
                      disabled={!title || !category}
                      className="px-4 py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {editingId ? "Update Design" : "Upload Design"}
                    </button>
                    {editingId && (
                      <button
                        onClick={() => {
                          setEditingId(null);
                          resetForm();
                        }}
                        className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </Card>

              <Card title="My Designs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {designs.map((d) => (
                    <div key={d.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        {d.imageUrl && !d.imageUrl.toLowerCase().endsWith(".pdf") ? (
                          <img src={d.imageUrl} alt={d.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-gray-500">📦 No Preview</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold">{d.title}</h4>
                        <p className="text-sm text-gray-600">{d.category}</p>
                        <p className="text-sm font-medium mt-1">${d.price.toLocaleString()}</p>
                        <div className="mt-3 flex gap-2">
                          <button onClick={() => startEdit(d)} className="px-3 py-1.5 border rounded-lg hover:bg-gray-50 text-sm">Edit</button>
                          <button onClick={() => handleDeleteDesign(d.id)} className="px-3 py-1.5 border rounded-lg hover:bg-red-50 text-sm text-construction-red">
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {designs.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500">No designs uploaded yet.</div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "marketplace" && (
            <div className="space-y-6">
              <Card title="Available Designs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {marketplace.map((d) => (
                    <div key={d.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-100 h-40 flex items-center justify-center">
                        {d.imageUrl && !d.imageUrl.toLowerCase().endsWith(".pdf") ? (
                          <img src={d.imageUrl} alt={d.title} className="h-full w-full object-cover" />
                        ) : (
                          <span className="text-gray-500">📦 No Preview</span>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold">{d.title}</h4>
                        <p className="text-sm text-gray-600">{d.category}</p>
                        <p className="text-sm text-gray-600">By {d.architectName || "Unknown"}</p>
                        <p className="text-lg font-semibold mt-1">${d.price.toLocaleString()}</p>
                        <button
                          onClick={() => handlePurchaseDesign(d)}
                          className="mt-3 w-full py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700"
                        >
                          Purchase / Download
                        </button>
                      </div>
                    </div>
                  ))}
                  {marketplace.length === 0 && (
                    <div className="col-span-full py-10 text-center text-gray-500">No other designs in marketplace yet.</div>
                  )}
                </div>
              </Card>
            </div>
          )}

          {activeTab === "profile" && (
            <div className="max-w-3xl">
              <Card title="Architect Profile">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input className="w-full border rounded-lg px-3 py-2" defaultValue="John Architect" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input className="w-full border rounded-lg px-3 py-2" defaultValue="john@arch.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="Architecture Studio" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input className="w-full border rounded-lg px-3 py-2" placeholder="Structural, Residential, etc." />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                  <textarea className="w-full border rounded-lg px-3 py-2" rows={4} placeholder="Tell clients about your experience..." />
                </div>
                <div className="mt-6">
                  <button className="px-6 py-2 bg-construction-blue text-white rounded-lg hover:bg-primary-700">Save Profile</button>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

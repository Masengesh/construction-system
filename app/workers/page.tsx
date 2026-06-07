import Link from "next/link";

export default function WorkersPage() {
  const workers = [
    { id: 1, name: "John Smith", role: "Project Manager", experience: "10+ years" },
    { id: 2, name: "Maria Garcia", role: "Site Engineer", experience: "8+ years" },
    { id: 3, name: "David Chen", role: "Construction Supervisor", experience: "12+ years" },
    { id: 4, name: "Sarah Johnson", role: "Quality Inspector", experience: "6+ years" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-construction-blue">ConstructPro</span>
            </Link>
            <div className="hidden sm:flex sm:space-x-8">
              <Link href="/" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</Link>
              <Link href="/about" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">About</Link>
              <Link href="/services" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
              <Link href="/workers" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Our Workers</Link>
              <Link href="/insights" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Insights</Link>
              <Link href="/contact" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-construction-blue to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Workers</h1>
          <p className="text-xl max-w-2xl">Meet our experienced team of construction professionals</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {workers.map((worker) => (
              <div key={worker.id} className="text-center p-6 border rounded-lg">
                <div className="w-24 h-24 bg-primary-600 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl">
                  👷
                </div>
                <h3 className="text-xl font-bold mb-1">{worker.name}</h3>
                <p className="text-primary-600 font-medium mb-1">{worker.role}</p>
                <p className="text-gray-500 text-sm">{worker.experience}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
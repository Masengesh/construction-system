import Link from "next/link";

export default function ServicesPage() {
  const services = [
    { icon: "🏢", title: "Commercial Construction", description: "Full-service commercial building solutions" },
    { icon: "🏠", title: "Residential Projects", description: "Custom home building and renovation" },
    { icon: "🔨", title: "Project Management", description: "End-to-end project oversight" },
    { icon: "📊", title: "Construction Planning", description: "Detailed project planning and scheduling" },
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
              <Link href="/services" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
              <Link href="/workers" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Our Workers</Link>
              <Link href="/insights" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Insights</Link>
              <Link href="/contact" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-construction-blue to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Services</h1>
          <p className="text-xl max-w-2xl">Comprehensive construction solutions for every project type</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <div key={service.title} className="text-center p-6 border rounded-lg hover:shadow-lg transition-shadow">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
import Link from "next/link";

export default function InsightsPage() {
  const insights = [
    { id: 1, title: "Top Construction Trends for 2024", date: "2024-01-15", excerpt: "Explore the latest innovations transforming the construction industry" },
    { id: 2, title: "Safety Best Practices on Construction Sites", date: "2024-01-10", excerpt: "Essential safety protocols for modern construction projects" },
    { id: 3, title: "Sustainable Building Materials Guide", date: "2024-01-05", excerpt: "A comprehensive look at eco-friendly construction materials" },
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
              <Link href="/workers" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Our Workers</Link>
              <Link href="/insights" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Insights</Link>
              <Link href="/contact" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-construction-blue to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Construction Insights</h1>
          <p className="text-xl max-w-2xl">Latest news, trends, and insights from the construction industry</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            {insights.map((post) => (
              <article key={post.id} className="border-b pb-8">
                <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                <p className="text-gray-500 text-sm mb-3">{post.date}</p>
                <p className="text-gray-600">{post.excerpt}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
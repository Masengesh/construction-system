import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link href="/" className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-construction-blue">ConstructPro</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Home</Link>
                <Link href="/about" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">About</Link>
                <Link href="/services" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
                <Link href="/workers" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Our Workers</Link>
                <Link href="/insights" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Insights</Link>
                <Link href="/contact" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              <Link href="/login" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Login</Link>
              <Link href="/register" className="ml-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">Register</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-construction-blue to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Construction Management Platform
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Comprehensive construction project tracking and management system for modern teams
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/register" className="px-8 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold">
                Get Started
              </Link>
              <Link href="/services" className="px-8 py-3 bg-white text-construction-blue rounded-lg hover:bg-gray-100 font-semibold">
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold mb-2">Project Management</h3>
              <p className="text-gray-600">Track all your construction projects from planning to completion</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">📋</div>
              <h3 className="text-xl font-bold mb-2">Task Tracking</h3>
              <p className="text-gray-600">Assign and monitor tasks with real-time updates</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">👥</div>
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">Connect your entire team in one centralized platform</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center">&copy; 2024 ConstructPro. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
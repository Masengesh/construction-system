import Link from "next/link";

export default function AboutPage() {
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
              <Link href="/about" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">About</Link>
              <Link href="/services" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Services</Link>
              <Link href="/workers" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Our Workers</Link>
              <Link href="/insights" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Insights</Link>
              <Link href="/contact" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-construction-blue to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About ConstructPro</h1>
          <p className="text-xl max-w-2xl">Building the future of construction management with innovative technology solutions</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
              <p className="text-gray-600 mb-4">
                We strive to revolutionize the construction industry by providing cutting-edge digital solutions that streamline project management, enhance team collaboration, and ensure project success.
              </p>
              <p className="text-gray-600">
                Our platform connects project managers, workers, and clients in a single unified interface, making construction project tracking seamless and efficient.
              </p>
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
              <ul className="space-y-3">
                <li className="flex items-start"><span className="text-primary-600 mr-2">✓</span>Real-time project tracking and updates</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">✓</span>Seamless team collaboration tools</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">✓</span>Comprehensive reporting and analytics</li>
                <li className="flex items-start"><span className="text-primary-600 mr-2">✓</span>Mobile-responsive design</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
import Link from "next/link";

export default function ContactPage() {
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
              <Link href="/insights" className="text-gray-500 hover:text-primary-600 px-3 py-2 text-sm font-medium">Insights</Link>
              <Link href="/contact" className="text-gray-900 hover:text-primary-600 px-3 py-2 text-sm font-medium">Contact</Link>
            </div>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-br from-construction-blue to-primary-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl max-w-2xl">Get in touch to discuss your construction project needs</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Get a Free Quote</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg" placeholder="Your name" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input type="email" className="w-full px-3 py-2 border rounded-lg" placeholder="Your email" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Project Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg">
                    <option>Commercial</option>
                    <option>Residential</option>
                    <option>Renovation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Message</label>
                  <textarea className="w-full px-3 py-2 border rounded-lg" rows={4} placeholder="Tell us about your project"></textarea>
                </div>
                <button className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700">Send Message</button>
              </form>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">📍</span>
                  <div>
                    <h3 className="font-semibold">Address</h3>
                    <p className="text-gray-600">123 Construction Ave, Building City, BC 12345</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">📞</span>
                  <div>
                    <h3 className="font-semibold">Phone</h3>
                    <p className="text-gray-600">+256 773 515 447</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-primary-600 mr-3 text-xl">✉️</span>
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-gray-600">info@constructpro.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
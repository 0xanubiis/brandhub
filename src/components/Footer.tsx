export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-800ite py-12 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset0low-hidden pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40-40gradient-to-r from-blue-500/20ple-50 rounded-full blur-3animate-float" />
        <div className="absolute -bottom-20 -left-20 w-40-40gradient-to-r from-pink-500red-50 rounded-full blur-3imate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60-60gradient-to-r from-green-50/10 to-blue-50 rounded-full blur-3imate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8ive z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Section */}
          <div className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold mb-6gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">About Us</h3>
            <p className="text-gray-30leading-relaxed">
              Brand Hub is your one-stop shop for high-quality products. We are committed to
              excellence and customer satisfaction with modern designs and premium experiences.
            </p>
          </div>

          {/* Links Section */}
          <div className="animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-6gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300t-white transition-all duration-30 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    Home
                    <span className="absolute -bottom-1eft-0 w-0 h-05gradient-to-r from-white to-gray-300group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300t-white transition-all duration-30 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    Products
                    <span className="absolute -bottom-1eft-0 w-0 h-05gradient-to-r from-white to-gray-300group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/AboutUs" className="text-gray-300t-white transition-all duration-30 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    About Us
                    <span className="absolute -bottom-1eft-0 w-0 h-05gradient-to-r from-white to-gray-300group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold mb-6gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Contact Us</h3>
            <div className="space-y-3">
              <p className="text-gray-300 flex items-center">
                <span className="w-2h-2gradient-to-r from-blue-400purple-500 rounded-full mr-3"></span>
                Email: In progress
              </p>
              <p className="text-gray-300 flex items-center">
                <span className="w-2h-2gradient-to-r from-green-400 to-blue-500 rounded-full mr-3"></span>
                Phone: In progress
              </p>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold mb-6gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Follow Us</h3>
            <div className="flex space-x-4">
              <a
                href="https://twitter.com/0xanubiis"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3gradient-to-r from-blue-500 to-blue-600over:from-blue-600 hover:to-blue-70nded-xl text-white transition-all duration-30er:scale-110 hover:shadow-lg">
                Twitter
              </a>
              <a
                href="https://instagram.com/blnk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3gradient-to-r from-pink-500o-purple-600over:from-pink-600over:to-purple-70nded-xl text-white transition-all duration-30er:scale-110 hover:shadow-lg">
                Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400ate-fade-up" style={{ animationDelay: '0.5s' }}>
            &copy; {new Date().getFullYear()} Brand Hub. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
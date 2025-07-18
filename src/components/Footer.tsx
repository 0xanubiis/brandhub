import { Mail, Phone, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black relative overflow-hidden text-white pb-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/50 rounded-full blur-3xl animate-float" />
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-r from-pink-500/20 to-red-500/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-gradient-to-r from-green-500/10 to-blue-500/50 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 lg:px-8 z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-16">
          {/* About Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">About Us</h3>
            <p className="text-gray-300 leading-relaxed">
              Brand Hub is your one-stop destination for premium products. We curate exceptional collections with modern designs and unparalleled quality, delivering excellence in every experience.
            </p>
          </div>

          {/* Links Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <a href="/" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    Home
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/products" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    Products
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/AboutUs" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    About Us
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
              <li>
                <a href="/admin/login" className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-2 inline-block group">
                  <span className="relative">
                    Admin Login
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-white to-gray-300 group-hover:w-full transition-all duration-300"></span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Contact Us</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10">
                <Mail className="h-5 w-5 text-blue-400" />
                <span className="text-gray-300">In progress...</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-800/50 backdrop-blur-sm rounded-xl border border-white/10">
                <Phone className="h-5 w-5 text-green-400" />
                <span className="text-gray-300">In progress...</span>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <h3 className="text-xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Follow Us</h3>
            <div className="grid grid-cols-2 gap-3">
              <a
                href="https://instagram.com/blnk.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href="https://github.com/0xanubiis/brandhub"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 rounded-xl text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex items-center justify-center gap-2"
              >
                <Github size={16} />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center pb-4">
          <p className="text-gray-400 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            &copy; {new Date().getFullYear()} Brand Hub. All rights reserved. Made with ❤️ by BLNK
          </p>
        </div>
      </div>
    </footer>
  );
}

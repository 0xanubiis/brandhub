import { Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-black text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p className="text-sm text-gray-300">
              Brand Hub is your one-stop destination for premium products.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/" className="text-sm text-gray-300 hover:text-white">Home</a></li>
              <li><a href="/products" className="text-sm text-gray-300 hover:text-white">Products</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p className="text-sm text-gray-300">Email: contact@brandhub.com</p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="https://instagram.com/blnk.dev" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Instagram size={20} />
              </a>
              <a href="https://github.com/0xanubiis/brandhub" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-6 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} Brand Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

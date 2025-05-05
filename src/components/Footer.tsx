import { Instagram, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white py-6 hover:bg-gray-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex space-x-6">
            <a
              href="https://instagram.com/blnk.group"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:scale-110 transition-transform duration-300"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a
              href="https://twitter.com/0xanubiis"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:scale-110 transition-transform duration-300"
            >
              <Twitter className="h-6 w-6" />
            </a>
          </div>
          <p className="text-black text-base transition-all duration-300">
            © {new Date().getFullYear()} BLNK Group. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
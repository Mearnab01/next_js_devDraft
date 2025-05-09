import { Blocks } from "lucide-react";
import Link from "next/link";

function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 mt-auto">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left Side: Logo and Tagline */}
          <div className="flex items-center gap-2 text-gray-400">
            <Blocks className="w-5 h-5" />
            <span>Empowering developers to build innovative solutions.</span>
          </div>

          {/* Right Side: Links and Credit */}
          <div className="flex items-center gap-6">
            <Link
              href="https://gmail.com"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Support
            </Link>
            <Link
              href="https://github.com/Mearnab01"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Github
            </Link>
            <Link
              href="/pricing"
              className="text-gray-400 hover:text-gray-300 transition-colors"
            >
              Pricing
            </Link>
            <span className="text-gray-400 hover:text-gray-300 transition-colors">
              © 2025 Arnab. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;

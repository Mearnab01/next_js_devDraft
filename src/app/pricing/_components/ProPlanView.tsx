import NavigationHeader from "@/components/NavigationHeader";
import { ArrowRight, Command, Star } from "lucide-react";
import Link from "next/link";

function ProPlanView() {
  return (
    <div className="bg-[#0a0a0f]">
      <NavigationHeader />
      <div className="relative px-4 h-[80vh] flex items-center justify-center">
        <div className="relative max-w-xl mx-auto text-center">
          {/* Gradient Borders */}
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
          <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-purple-500/70 to-transparent animate-pulse" />
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-3xl opacity-20" />

          {/* Main Card */}
          <div className="relative bg-[#12121a]/90 border border-gray-800/50 backdrop-blur-2xl rounded-3xl p-12 hover:scale-105 transition-transform duration-300 shadow-lg shadow-blue-500/20">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] to-purple-500/[0.08] rounded-3xl" />

            <div className="relative">
              {/* Star Icon */}
              <div className="inline-flex p-4 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 mb-6 ring-1 ring-gray-800/60 transition-transform duration-300 hover:scale-110">
                <Star className="w-8 h-8 text-purple-400 animate-spin-slow" />
              </div>

              {/* Title & Subtitle */}
              <h1 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">
                Pro Plan Activated 🎉
              </h1>
              <p className="text-gray-300 text-lg mb-8 transition-colors hover:text-gray-100">
                Unlock the complete professional development experience!
              </p>

              {/* Open Editor Button */}
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-3 w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all duration-300 border border-transparent hover:border-blue-500 group shadow-md shadow-purple-500/20 hover:shadow-blue-500/20"
              >
                <Command className="w-6 h-6 text-blue-300 group-hover:text-blue-400" />
                <span className="text-lg">Open Code Editor</span>
                <ArrowRight className="w-6 h-6 text-purple-300 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProPlanView;

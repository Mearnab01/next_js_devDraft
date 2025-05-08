"use client";
import { Zap } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
export default function UpgradeButton() {
  const CHEKOUT_URL =
    "https://my-code-store.lemonsqueezy.com/buy/2da78060-07cf-4de3-ac67-3965e817e1cf";

  return (
    <Link href={CHEKOUT_URL}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative inline-flex items-center justify-center gap-2 px-8 py-4 text-white 
          bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg overflow-hidden 
          transition-transform duration-300"
      >
        <Zap className="w-5 h-5" />
        <span className="relative z-10">Upgrade to Pro</span>

        {/* Shine Effect */}
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent 
            opacity-40 rounded-lg -skew-x-12"
        />
      </motion.div>
    </Link>
  );
}

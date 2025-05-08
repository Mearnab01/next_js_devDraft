"use client";

import { Snippet } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { motion } from "framer-motion";

import Link from "next/link";
import { Clock, Trash2, User } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import StarButton from "@/components/StarButton";

function SnippetCard({ snippet }: { snippet: Snippet }) {
  const { user } = useUser();
  const deleteSnippet = useMutation(api.snippets.deleteSnippet);
  const [isDeleting, setIsDeleting] = useState(false);
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteSnippet({ snippetId: snippet._id });
      toast.success("Snippet deleted successfully");
    } catch (error) {
      console.log("Error deleting snippet:", error);
      toast.error("Error deleting snippet");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <motion.div
      layout
      className="group relative"
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <Link href={`/snippets/${snippet._id}`} className="h-full block">
        <div
          className="relative h-full bg-gradient-to-br from-[#1e1e2e]/80 to-[#2a2a3a]/80 backdrop-blur-lg rounded-xl 
      border border-[#313244]/50 hover:border-blue-400 
      transition-all duration-300 overflow-hidden shadow-lg group-hover:shadow-blue-500/50"
        >
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur-lg opacity-20 
                group-hover:opacity-40 transition-all duration-500"
                    aria-hidden="true"
                  />
                  <div
                    className="relative p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 group-hover:from-blue-600/30
                group-hover:to-purple-600/30 transition-all duration-500"
                  >
                    <Image
                      src={`/${snippet.language}.png`}
                      alt={`${snippet.language} logo`}
                      className="w-6 h-6 object-contain relative z-10"
                      width={24}
                      height={24}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-xs font-medium">
                    {snippet.language}
                  </span>
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Clock className="size-3" />
                    {new Date(snippet._creationTime).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div
                className="absolute top-5 right-5 z-10 flex gap-4 items-center"
                onClick={(e) => e.preventDefault()}
              >
                <div>
                  <StarButton snippetId={snippet._id} />
                </div>

                {user?.id === snippet.userId && (
                  <div className="z-10" onClick={(e) => e.preventDefault()}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className={`group flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all duration-200
                    ${
                      isDeleting
                        ? "bg-red-500/20 text-red-400 cursor-not-allowed"
                        : "bg-gray-700/20 text-gray-300 hover:bg-red-500/10 hover:text-red-400"
                    }`}
                    >
                      {isDeleting ? (
                        <div className="size-3.5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
                      ) : (
                        <Trash2 className="size-4" />
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-100 mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
                  {snippet.title}
                </h2>
                <div className="flex items-center gap-3 text-sm text-gray-400">
                  <div className="flex items-center gap-2">
                    <div className="p-1 rounded-md bg-gray-800/50">
                      <User className="size-3" />
                    </div>
                    <span className="truncate max-w-[150px]">
                      {snippet.userName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative group/code">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/15 to-purple-500/5 rounded-lg opacity-0 
              group-hover/code:opacity-100 transition-all duration-300"
                />
                <pre className="relative bg-black/30 rounded-lg p-4 overflow-hidden text-sm text-gray-300 font-mono line-clamp-3">
                  {snippet.code}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default SnippetCard;

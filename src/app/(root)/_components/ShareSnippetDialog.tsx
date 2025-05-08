import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import { useMutation } from "convex/react";
import { useState } from "react";
import { api } from "../../../../convex/_generated/api";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

function ShareSnippetDialog({ onClose }: { onClose: () => void }) {
  const [title, setTitle] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const { language, getCode } = useCodeEditorStore();
  const createSnippet = useMutation(api.snippets.createSnippet);

  const handleShare = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSharing(true);

    try {
      const code = getCode();
      await createSnippet({ title, language, code });
      onClose();
      setTitle("");
      toast.success("Snippet shared successfully");
    } catch (error) {
      console.log("Error creating snippet:", error);
      toast.error("Error creating snippet");
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="bg-[#1e1e2e] border border-[#313244] shadow-xl rounded-xl p-6 w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-white">
              🚀 Share Snippet
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleShare}>
            {/* Input */}
            <div className="mb-5">
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-400 mb-2"
              >
                Snippet Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My epic JS solution"
                required
                className="w-full px-3 py-2 text-white bg-[#181825] border border-[#313244] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-gray-500"
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSharing}
                className="px-5 py-2 rounded-lg bg-gradient-to-tr from-blue-500 to-purple-600 text-white font-medium shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSharing ? "Sharing..." : "Share"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
export default ShareSnippetDialog;

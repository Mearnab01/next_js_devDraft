"use client";
import useMounted from "@/hooks/useMounted";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";
import React, { useEffect, useState } from "react";
import { defineMonacoThemes, LANGUAGE_CONFIG } from "../_constants";
import Image from "next/image";
import {
  LightbulbIcon,
  RotateCcwIcon,
  ShareIcon,
  TypeIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Editor } from "@monaco-editor/react";
import { EditorPanelSkeleton } from "./EditorPanelSkeleton";
import { useClerk, useUser } from "@clerk/nextjs";
import ShareSnippetDialog from "./ShareSnippetDialog";
import ConfirmDialog from "./ConfirmDialog";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

function EditorPanel() {
  const clerk = useClerk();
  const { isSignedIn, user } = useUser();

  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const [isPro, setIsPro] = useState(false);

  const [loadingAI, setLoadingAI] = useState(false);
  const { language, theme, fontSize, editor, setFontSize, setEditor } =
    useCodeEditorStore();

  const mounted = useMounted();
  const fetchAISuggestion = async (prompt: string) => {
    try {
      const response = await fetch("/api/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      return data.suggestion || "No suggestion available.";
    } catch (error) {
      console.error("Failed to fetch AI suggestion:", error);
      return "Error fetching suggestion.";
    }
  };

  useEffect(() => {
    const savedCode = localStorage.getItem(`editor-code-${language}`);
    const newCode = savedCode || LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(newCode);
  }, [language, editor]);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("editor-font-size");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));
  }, [setFontSize]);

  const handleRefresh = () => {
    const defaultCode = LANGUAGE_CONFIG[language].defaultCode;
    if (editor) editor.setValue(defaultCode);
    localStorage.removeItem(`editor-code-${language}`);
  };

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  };
  const handleFontSizeChange = (newSize: number) => {
    const size = Math.min(Math.max(newSize, 12), 24);
    setFontSize(size);
    localStorage.setItem("editor-font-size", size.toString());
  };

  const handleSuggest = async () => {
    if (!editor) return;
    const currentCode = editor.getValue();
    setLoadingAI(true);
    const suggestion = await fetchAISuggestion(currentCode);
    editor.setValue(currentCode + "\n\n// AI Suggestion:\n" + suggestion);
    setLoadingAI(false);
  };

  useEffect(() => {
    const fetchProStatus = async () => {
      if (isSignedIn && user) {
        try {
          const convexUser = await convex.query(api.users.getUser, {
            userId: user.id,
          });
          setIsPro(convexUser?.isPro || false);
        } catch (error) {
          console.error("Error fetching Pro status:", error);
        }
      }
    };
    fetchProStatus();
  }, [isSignedIn, user, convex]);
  if (!mounted) return null;

  return (
    <div className="relative">
      <div className="relative bg-[#12121a]/90 backdrop-blur rounded-xl border border-white/[0.05] p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1e1e2e] ring-1 ring-white/5">
              <Image
                src={"/" + language + ".png"}
                alt="Logo"
                width={24}
                height={24}
              />
            </div>
            <div className="hidden lg:flex">
              <h2 className="text-sm font-medium text-white">Code Editor</h2>
              <p className="text-xs text-gray-500">
                Write and execute your code
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Font Size Slider */}
            <div className="hidden lg:flex items-center gap-3 px-3 py-2 bg-[#1e1e2e] rounded-lg ring-1 ring-white/5">
              <TypeIcon className="size-4 text-gray-400" />
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="12"
                  max="24"
                  value={fontSize}
                  onChange={(e) =>
                    handleFontSizeChange(parseInt(e.target.value))
                  }
                  className="w-20 h-1 bg-gray-600 rounded-lg cursor-pointer"
                />
                <span className="text-sm font-medium text-gray-400 min-w-[2rem] text-center">
                  {fontSize}
                </span>
              </div>
            </div>
            {/* Refresh */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsConfirmOpen(true)}
              className="p-2 bg-[#1e1e2e] hover:bg-[#2a2a3a] rounded-lg ring-1 ring-white/5 transition-colors"
              aria-label="Reset to default code"
            >
              <RotateCcwIcon className="size-4 text-gray-400" />
            </motion.button>
            {/* AI Suggestion Button */}
            {isSignedIn && isPro && (
              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSuggest}
                  disabled={loadingAI}
                  className={`px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold text-white transition-all 
              ${loadingAI ? "bg-gray-600" : "bg-gradient-to-r from-blue-500 to-purple-500 hover:scale-105"}`}
                >
                  <LightbulbIcon className="w-4 h-4" />
                  {loadingAI ? "Loading..." : "AI Suggest"}
                </motion.button>
              </div>
            )}
            {/* Share Button */}
            {isSignedIn && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsShareDialogOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg overflow-hidden bg-gradient-to-r
               from-blue-500 to-blue-600 opacity-90 hover:opacity-100 transition-opacity"
              >
                <ShareIcon className="size-4 text-white" />
                <span className="text-sm font-medium text-white ">Share</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Editor  */}
        <div className="relative group rounded-xl overflow-hidden ring-1 ring-white/[0.05]">
          {clerk.loaded && (
            <Editor
              height="600px"
              language={LANGUAGE_CONFIG[language].monacoLanguage}
              onChange={handleEditorChange}
              theme={theme}
              beforeMount={defineMonacoThemes}
              onMount={(editor) => setEditor(editor)}
              options={{
                minimap: { enabled: false },
                fontSize,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                padding: { top: 16, bottom: 16 },
                renderWhitespace: "selection",
                fontFamily: '"Fira Code", "Cascadia Code", Consolas, monospace',
                fontLigatures: true,
                cursorBlinking: "smooth",
                smoothScrolling: true,
                contextmenu: true,
                renderLineHighlight: "all",
                lineHeight: 1.6,
                letterSpacing: 0.5,
                roundedSelection: true,
                scrollbar: {
                  verticalScrollbarSize: 8,
                  horizontalScrollbarSize: 8,
                },

                // 🧠 Code Intelligence & Formatting
                folding: true,
                wordWrap: "on",
                suggestOnTriggerCharacters: true,
                quickSuggestions: {
                  other: true,
                  comments: false,
                  strings: true,
                },
                autoClosingBrackets: "always",
                autoClosingQuotes: "always",
                formatOnType: true,
                formatOnPaste: true,

                // 🎨 Visual & UX Enhancements
                matchBrackets: "always",
                selectionHighlight: true,
                codeLens: true,
                inlayHints: {
                  enabled: "on",
                },
                bracketPairColorization: true,
                "editor.guides.bracketPairs": "active",

                // 🧱 Structure & Style
                tabSize: 2,
                insertSpaces: true,
                detectIndentation: false,

                // 🧼 Accessibility & QoL
                accessibilitySupport: "on",
                cursorSmoothCaretAnimation: true,
                dragAndDrop: false,
                mouseWheelZoom: true,
              }}
            />
          )}

          {!clerk.loaded && <EditorPanelSkeleton />}
        </div>
      </div>
      {isShareDialogOpen && (
        <ShareSnippetDialog onClose={() => setIsShareDialogOpen(false)} />
      )}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleRefresh}
        title="Reset code to default?"
        description="This will erase your current code and restore the original default snippet."
        confirmText="Reset"
        cancelText="Cancel"
      />
    </div>
  );
}
export default EditorPanel;

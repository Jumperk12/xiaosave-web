"use client";

import { useState } from "react";
import { Clipboard, Loader2 } from "lucide-react";
import Link from "next/link";
import Script from "next/script";

export default function Home() {
  const [urlString, setUrlString] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrlString(text);
    } catch (err) {
      console.error("Failed to read clipboard contents: ", err);
    }
  };

  const handleAnalyze = async () => {
    if (!urlString) return;
    
    setIsAnalyzing(true);
    setError(null);
    setVideoUrl(null);

    // Simulate network delay for effect
    setTimeout(async () => {
      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: urlString }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to analyze link");
        }

        setVideoUrl(data.masterUrl);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsAnalyzing(false);
      }
    }, 800);
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingType, setProcessingType] = useState<"video" | "audio" | "raw" | null>(null);

  const handleDownload = async (url: string, type: "video" | "audio" | "raw") => {
    setIsProcessing(true);
    setProcessingType(type);
    setError(null);

    const apiRoute = type === "video" ? "/api/process-video" : type === "audio" ? "/api/process-audio" : "/api/download-raw";
    const filename = type === "video" ? "xiaosave-watermark-free.mp4" : type === "audio" ? "xiaosave-audio.mp3" : "xiaosave-480p.mp4";

    try {
      const response = await fetch(apiRoute, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoUrl: url }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to process ${type}`);
      }

      // Convert the response to a downloadable file (Blob)
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsProcessing(false);
      setProcessingType(null);
    }
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center">
      <div className="w-full max-w-md flex flex-col px-6 pt-20 space-y-8">
        
        {/* Logo & SEO H1 */}
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-black tracking-tight">
            <span className="text-[#ff3b30]">Xiao</span>
            <span className="text-[#007aff]">save</span>
            {/* The rest of the H1 is visually hidden for screen readers and SEO bots */}
            <span className="sr-only"> - Free RedNote (Xiaohongshu) Video Downloader without Watermark</span>
          </h1>
        </div>

        {/* Input Area */}
        <div className="flex flex-row items-center bg-[#2a2a2c] rounded-2xl pr-2 pl-4 py-2 mt-4 shadow-sm">
          <input
            type="text"
            value={urlString}
            onChange={(e) => setUrlString(e.target.value)}
            placeholder="Paste Video Link Here"
            className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
          />
          <button
            onClick={handlePaste}
            className="bg-[#007aff] hover:bg-blue-500 text-white p-3 rounded-xl ml-2 flex items-center justify-center transition-colors"
          >
            <Clipboard size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Analyze Button */}
        <button 
          onClick={handleAnalyze}
          disabled={isAnalyzing || isProcessing || !urlString}
          className="w-full bg-[#ff3b30] hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all shadow-md flex items-center justify-center space-x-2"
        >
          {isAnalyzing && <Loader2 className="animate-spin" size={20} />}
          <span>{isAnalyzing ? "Analyzing..." : "Analyze Link"}</span>
        </button>

        {/* Error Message */}
        {error && (
          <div className="text-[#ff3b30] text-center text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Results Section */}
        {videoUrl && (
          <div className="flex flex-col items-center space-y-4 pt-6 animate-in fade-in duration-300 w-full">
            <h2 className="text-[#34c759] text-base font-bold mb-2">Ready to Download!</h2>
            
            {/* Option 1: HD Video (Ad) */}
            <button 
              onClick={() => handleDownload(videoUrl, "video")}
              disabled={isProcessing}
              className="w-full bg-gradient-to-r from-orange-400 to-[#ff3b30] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md transition-all text-sm flex justify-center items-center space-x-2"
            >
              {isProcessing && processingType === "video" && <Loader2 className="animate-spin" size={16} />}
              <span>{isProcessing && processingType === "video" ? "Processing Video..." : "Download without watermark (HD) - Ad"}</span>
            </button>

            {/* Option 2: 480p Video */}
            <button 
              onClick={() => handleDownload(videoUrl, "raw")}
              disabled={isProcessing}
              className="w-full bg-[#007aff] hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md transition-all text-sm flex justify-center items-center space-x-2"
            >
              {isProcessing && processingType === "raw" && <Loader2 className="animate-spin" size={16} />}
              <span>{isProcessing && processingType === "raw" ? "Downloading..." : "Download without watermark (480p)"}</span>
            </button>

            {/* Option 3: MP3 Audio */}
            <button 
              onClick={() => handleDownload(videoUrl, "audio")}
              disabled={isProcessing}
              className="w-full bg-[#34c759] hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md transition-all text-sm flex justify-center items-center space-x-2"
            >
              {isProcessing && processingType === "audio" && <Loader2 className="animate-spin" size={16} />}
              <span>{isProcessing && processingType === "audio" ? "Extracting MP3..." : "Download MP3"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Links */}
      <footer className="mt-12 mb-6 w-full flex justify-center space-x-6 text-gray-500 text-sm">
        <Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-white transition-colors">Terms of Use</Link>
        <Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link>
      </footer>

      {/* Adsterra Native Banner */}
      <div className="w-full mt-auto flex items-center justify-center min-h-[100px] bg-[#1a1a1c] border-t border-gray-800">
        <div id="container-2468dad4a31901929901d57b038f8921"></div>
        <Script 
          src="//pl30261030.effectivecpmnetwork.com/2468dad4a31901929901d57b038f8921/invoke.js" 
          strategy="afterInteractive" 
          data-cfasync="false" 
        />
      </div>

      {/* Adsterra Social Bar */}
      <Script 
        src="https://pl30261031.effectivecpmnetwork.com/19/ae/c6/19aec6296ae4fd4c476c9b0e075404c0.js" 
        strategy="afterInteractive" 
      />
    </main>
  );
}

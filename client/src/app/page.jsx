"use client";
import Link from "next/link";
import Navbar from "./Component/nav";
import Download from "./Component/download";
import Upload from "./Component/upload";
import { useEffect } from "react";

export default function Home() {
  const VITE_HOST =
    process.env.NEXT_PUBLIC_NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
      : process.env.NEXT_PUBLIC_BACKEND_LOCAL

  useEffect(() => {
    fetch(`${VITE_HOST}/ping`);
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 md:p-12 lg:p-24 bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white duration-500 caret-transparent selection:text-black selection:bg-white overflow-hidden">
        {/* Background Animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10 text-center animate-fade-in-up mt-22 md:mt-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent animate-gradient-x">
            Vanis
          </h1>
          <p className="text-center max-w-2xl text-gray-300 mb-16 px-4 text-lg sm:text-xl md:text-2xl leading-relaxed animate-fade-in-up delay-200">
            Helping you share files temporarily and securely while being
            anonymous.
          </p>
        </div>

        {/* Action Boxes */}
        <div className="relative z-10 flex flex-col lg:flex-row w-full max-w-4xl gap-8 sm:gap-12 mb-16 animate-fade-in-up delay-400">
          {/* Upload Box */}
          <Link href="/upload" className="flex-1 group">
            <div className="flex justify-center">
              <div className="border-2 border-dotted border-gray-500 bg-gray-900/50 backdrop-blur-sm p-6 sm:p-8 md:p-10 rounded-3xl w-full max-w-sm hover:border-white hover:bg-gray-800/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 group-hover:animate-pulse-slow">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex justify-center items-center">
                    <Upload />
                  </div>
                  <h2 className="mt-[-50px] text-2xl sm:text-3xl md:text-4xl font-semibold text-center group-hover:text-purple-300 transition-colors duration-300">
                    Upload
                  </h2>
                  <p className="text-gray-400 text-center text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Share your files securely
                  </p>
                </div>
              </div>
            </div>
          </Link>

          {/* Download Box */}
          <Link href="/download" className="flex-1 group">
            <div className="flex justify-center">
              <div className="border-2 border-dotted border-gray-400 bg-white p-6 sm:p-8 md:p-10 rounded-3xl w-full max-w-sm hover:border-gray-600transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 group-hover:animate-pulse-slow">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <div className="flex justify-center items-center z-0">
                    <Download />
                  </div>
                  <h2 className="z-1 mt-[-50px] text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-black group-hover:text-blue-600 transition-colors duration-300">
                    Download
                  </h2>
                  <p className="text-gray-600 text-center text-sm sm:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Access shared files
                  </p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* CTA Button */}
        <div className="relative z-10 animate-fade-in-up delay-600">
          <a href="https://donate-lynxx.netlify.app/" target="_blank" rel="noreferrer">
            <button className="px-8 py-4 text-black bg-white hover:bg-gray-200 rounded-2xl text-lg sm:text-xl font-semibold transition-all duration-500 hover:scale-110 hover:shadow-lg hover:shadow-white/20 active:scale-95">
              Support the Project
            </button>
          </a>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-white/20 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-purple-400/30 rounded-full animate-float delay-1000"></div>
        <div className="absolute bottom-32 left-20 w-2 h-2 bg-blue-400/30 rounded-full animate-float delay-2000"></div>
      </main>
    </>
  );
}

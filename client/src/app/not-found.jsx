"use client";

import Link from "next/link";
import { FileX, Home, Download, ArrowRight } from "lucide-react";
import Navbar from "./component/nav";
import { motion } from "framer-motion";

export default function NotFound() {
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-gray-950 to-black pt-16 caret-transparent selection:text-black selection:bg-white text-white flex items-center justify-center px-4">
        <motion.div
          className="container mx-auto py-8 max-w-2xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center mb-8">
            {/* 404 Icon */}
            <motion.div variants={itemVariants} className="mb-8">
              <FileX className="mx-auto h-24 w-24 text-gray-600 mb-4 animate-pulse-slow" />{" "}
              {/* Larger icon, subtle pulse */}
              <motion.div
                className="text-7xl md:text-8xl font-extrabold text-gray-800 mb-4 drop-shadow-lg"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                404
              </motion.div>
            </motion.div>
            <motion.h1
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-4"
            >
              Page Not Found
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="text-sm md:text-base max-w-xl mx-auto mb-8"
            >
              The page you're looking for doesn't exist or may have been moved.
              The file might have expired or the link could be broken.
            </motion.p>
          </div>

          {/* Action Cards */}
          <div className="space-y-4 mb-8">
            {/* Go Home */}
            <motion.div variants={itemVariants}>
              <Link
                href="/"
                className="group block w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shine"></div>
                <div className="p-5 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Home className="h-7 w-7 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white group-hover:text-white transition-colors">
                      Go to Home Page
                    </h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      Return to the main page and explore our services
                    </p>
                  </div>
                  <div className="flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>

            {/* Download Page */}
            <motion.div variants={itemVariants}>
              <Link
                href="/download"
                className="group block w-full bg-gray-900 border border-gray-700 rounded-xl shadow-xl hover:bg-gray-800 transition-all duration-300 transform hover:scale-[1.01] relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-800/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shine"></div>
                <div className="p-5 flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Download className="h-7 w-7 text-gray-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white group-hover:text-white transition-colors">
                      Try Download Page
                    </h3>
                    <p className="text-xs text-gray-400 group-hover:text-gray-300 transition-colors">
                      Enter a download code to access shared files
                    </p>
                  </div>
                  <div className="flex-shrink-0 transform group-hover:translate-x-1 transition-transform duration-300">
                    <ArrowRight className="h-5 w-5 text-gray-500 group-hover:text-white transition-colors" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>

          {/* Help Section */}
          <motion.div
            variants={itemVariants}
            className="bg-gray-900 border border-gray-700 rounded-xl shadow-xl"
          >
            <div className="p-5 border-b border-gray-700">
              <h2 className="text-lg text-white font-semibold">
                Common Issues
              </h2>
            </div>
            <div className="p-5">
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full mt-2.5"></div>
                  <div>
                    <p className="text-gray-300 font-medium">
                      Expired Download Link
                    </p>
                    <p className="text-xs text-gray-400">
                      Files are automatically deleted after their expiry time.
                      Request a new link from the sender.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full mt-2.5"></div>
                  <div>
                    <p className="text-gray-300 font-medium">
                      Invalid Download Code
                    </p>
                    <p className="text-xs text-gray-400">
                      Double-check the download code or link. Codes are
                      case-sensitive and usually 6 characters long.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full mt-2.5"></div>
                  <div>
                    <p className="text-gray-300 font-medium">Broken URL</p>
                    <p className="text-xs text-gray-400">
                      The URL might be incomplete or corrupted. Try copying the
                      link again from the original source.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Back Button */}
          <motion.div variants={itemVariants} className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowRight className="h-4 w-4 transform rotate-180 group-hover:-translate-x-1 transition-transform duration-300" />
              <span className="text-sm font-medium">
                Go back to previous page
              </span>
            </button>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}

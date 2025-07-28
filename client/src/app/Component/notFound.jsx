"use client";

import Link from "next/link";
import { FileX, Home, Download, ArrowLeft } from "lucide-react";
import Navbar from "./navbar";

export default function Custom404() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-16">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8">
            {/* 404 Icon */}
            <div className="mb-8">
              <FileX className="mx-auto h-24 w-24 text-gray-600 mb-4" />
              <div className="text-8xl md:text-9xl font-bold text-gray-800 mb-4">
                404
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto mb-8">
              The page you're looking for doesn't exist or may have been moved.
              The file might have expired or the link could be broken.
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-4 mb-8">
            {/* Go Home */}
            <Link
              href="/"
              className="block w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Home className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white">
                      Go to Upload Page
                    </h3>
                    <p className="text-sm text-gray-400">
                      Start uploading and sharing files securely
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <ArrowLeft className="h-5 w-5 text-gray-500 rotate-180" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Download Page */}
            <Link
              href="/download"
              className="block w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg hover:bg-gray-800 transition-colors"
            >
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <Download className="h-8 w-8 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-medium text-white">
                      Try Download Page
                    </h3>
                    <p className="text-sm text-gray-400">
                      Enter a download code to access shared files
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <ArrowLeft className="h-5 w-5 text-gray-500 rotate-180" />
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* Help Section */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-white text-lg font-semibold">
                Common Issues
              </h2>
            </div>
            <div className="p-6">
              <div className="space-y-4 text-sm">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-300 font-medium">
                      Expired Download Link
                    </p>
                    <p className="text-gray-400">
                      Files are automatically deleted after their expiry time.
                      Request a new link from the sender.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-300 font-medium">
                      Invalid Download Code
                    </p>
                    <p className="text-gray-400">
                      Double-check the download code or link. Codes are
                      case-sensitive and usually 6 characters long.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-2 h-2 bg-gray-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-gray-300 font-medium">Broken URL</p>
                    <p className="text-gray-400">
                      The URL might be incomplete or corrupted. Try copying the
                      link again from the original source.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Back Button */}
          <div className="mt-8 text-center">
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">Go back to previous page</span>
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

"use client";
import { useState } from "react";
import {
  Download,
  File,
  Clock,
  Shield,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Navbar from "../component/nav.jsx";
import Loading from "../component/loading.jsx";
import { toast } from "sonner";

export default function ClientPage() {
  const [downloadCode, setDownloadCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const VITE_HOST =
    process.env.NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
      : process.env.NEXT_PUBLIC_BACKEND_LOCAL;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isExpired, setIsExpired] = useState(false);

  // // Mock file database
  // const mockFiles = {
  //   ABC123: {
  //     id: "1",
  //     name: "presentation.pdf",
  //     size: 2048000,
  //     uploadDate: new Date(Date.now() - 3600000),
  //     expiresAt: new Date(Date.now() + 20 * 3600000),
  //     type: "application/pdf",
  //   },
  // };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const getTimeRemaining = (createdAt, lifeSpan) => {
    const created = new Date(createdAt);
    const expiresAt = new Date(created.getTime() + lifeSpan * 60 * 60 * 1000);

    const now = new Date();
    const timeLeft = expiresAt - now;

    if (timeLeft <= 0) {
      setIsExpired(true);
      return "Expired";
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60));
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));

    if (hours > 0) {
      return `Expires in ${hours}h ${minutes}m`;
    }
    return `Expires in ${minutes}m`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!downloadCode.trim()) {
      setError("Please enter a download code or link");
      return;
    }

    setLoading(true);
    setError("");

    // DONE: API call here
    if (downloadCode.length === 6) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${VITE_HOST}/api/file/getFile?code=${downloadCode}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setUploadedFiles([]);
          setUploadedFiles([...data.uploadedFilesResponse]);
          setDownloaded(false);
        } else {
          setUploadedFiles([]);
          setError("No files found for the provided code.");
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching files: ", err);
      }
    } else if (downloadCode.length === 8) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${VITE_HOST}/api/file/getFolder?code=${downloadCode}`,
          {
            method: "GET",
          }
        );

        const data = await response.json();

        if (response.ok && data.success) {
          setUploadedFiles([]);
          setUploadedFiles([...data.uploadedFilesResponse]);
          setDownloaded(false);
        } else {
          setUploadedFiles([]);
          setError("No files found for the provided code.");
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching files: ", err);
      }
    } else {
      setError("Invalid code. Please enter a valid code.");
    }

    // TODO: Extract code from URL if full link is pasted
    // let code = downloadCode.trim();
    // if (code.includes("/download/")) {
    //   code = code.split("/download/")[1];
    // }
    // if (code.includes("?code=")) {
    //   code = code.split("?code=")[1];
    // }

    setDownloadCode("");
    setLoading(false);
  };

  const handleDownload = async (fileName) => {
    toast.info(`Downloading...`);
    // DONE: Implement download logic here
    try {
      setIsLoading(true);
      const response = await fetch(
        `${VITE_HOST}/api/file/downloadFile/${fileName}`,
        {
          method: "GET",
        }
      );

      if (!response.ok) {
        const data = await response.json();
        toast.error(data.message || "Failed to download file");
      } else {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
        toast.success(`File downloaded successfully!`);
      }
      setIsLoading(false);
    } catch (err) {
      console.log("Error downloading file: ", err);
      toast.error("Failed to download file");
    }
    setDownloaded(true);
  };

  return (
    <>
      {isLoading && <Loading />}
      <Navbar />
      <main className="min-h-screen bg-black caret-transparent selection:text-black selection:bg-white">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="text-center mb-8 mt-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Download File
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
              Enter your download code or paste the shared link to access your
              file.
            </p>
          </div>

          {/* Download Code Input */}
          <div className="mb-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="downloadCode"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Download Code or Link
                  </label>
                  <input
                    type="text"
                    id="downloadCode"
                    value={downloadCode}
                    onChange={(e) => setDownloadCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 caret-white"
                  />
                </div>

                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-sm">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-400 border-t-white"></div>
                      <span>Checking...</span>
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      <span>Access File</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="flex items-center space-x-2 text-white text-lg font-semibold">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>Available Files</span>
              </h2>
            </div>
            <div className="p-6">
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No files available
                </p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white truncate">
                            {file.fileName}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>
                              {/* {new Date(file.createdAt).toLocaleDateString()} at{" "}
                              {new Date(file.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })} */}
                              {new Date(file.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs bg-gray-600 text-gray-200 border border-gray-500 hover:bg-gray-500 px-2 py-1 rounded-md">
                          {getTimeRemaining(file.createdAt, file.lifeSpan)}
                        </span>
                        <button
                          onClick={() => handleDownload(file.fileName)}
                          disabled={isExpired}
                          className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-3 py-1 rounded-md text-sm font-medium inline-flex items-center transition-colors"
                        >
                          Download
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm">
              Need help? The download code is usually 6 or 8 characters long
              (e.g., ABC123, ABCD1234)
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

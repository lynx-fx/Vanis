"use client";
import { useState, useEffect } from "react";
import { Download, File, Clock, AlertCircle } from "lucide-react";
import Navbar from "../../Component/nav.jsx";
import Loading from "../../Component/loading.jsx";
import { toast } from "sonner";

export default function DownloadClient({ code }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const VITE_HOST =
    process.env.NEXT_PUBLIC_NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
      : process.env.NEXT_PUBLIC_BACKEND_LOCAL;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (code) {
      // Only fetch if code is provided
      getFiles();
    } else {
      setError("Please provide a download code or link in the URL.");
    }
  }, [code]); // Depend on code prop

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

  const getFiles = async () => {
    setLoading(true);
    setError("");

    if (code.length === 6) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${VITE_HOST}/api/file/getFile?code=${code}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setUploadedFiles([...data.uploadedFilesResponse]);
        } else {
          setUploadedFiles([]);
          setError("No files found for the provided code.");
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching files: ", err);
        setError("Failed to fetch files. Please try again later.");
      }
    } else if (code.length === 8) {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${VITE_HOST}/api/file/getFolder?code=${code}`,
          {
            method: "GET",
          }
        );
        const data = await response.json();
        if (response.ok && data.success) {
          setUploadedFiles([...data.uploadedFilesResponse]);
        } else {
          setUploadedFiles([]);
          setError("No files found for the provided code.");
        }
        setIsLoading(false);
      } catch (err) {
        setIsLoading(false);
        console.error("Error fetching files: ", err);
        setError("Failed to fetch files. Please try again later.");
      }
    } else {
      setUploadedFiles([]);
      setError("Invalid code. Please provide a valid 6 or 8 character code.");
    }
    setLoading(false);
  };

  const handleDownload = async (fileName) => {
    toast.info(`Downloading...`);
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
  };

  return (
    <>
      {isLoading && <Loading />}
      <Navbar />
      <main className="min-h-screen bg-black pt-16 caret-transparent selection:text-black selection:bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8 mt-16 sm:mt-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">
              Download File
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto px-4">
              Files hooked to link will be displayed here. Use the download code provided in the URL to access your files.
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 sm:mb-8 bg-red-900/20 border border-red-700 rounded-lg shadow-lg p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center space-x-2 text-red-400 text-sm sm:text-base">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Available Files Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <h2 className="flex items-center space-x-2 text-white text-base sm:text-lg font-semibold">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <span>Available Files</span>
              </h2>
            </div>
            <div className="p-4 sm:p-6">
              {uploadedFiles.length === 0 && !error ? (
                <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">
                  Enter a code in the URL to view files.
                </p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-lg gap-y-3 sm:gap-x-4"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">
                            {file.fileName}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-gray-400 space-y-1 sm:space-y-0">
                            <span>{formatFileSize(file.size)}</span>
                            <span>
                              {new Date(file.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                        <span className="text-xs bg-gray-600 text-gray-200 border border-gray-500 px-2 py-1 rounded-md whitespace-nowrap w-full text-center sm:w-auto">
                          {getTimeRemaining(file.createdAt, file.lifeSpan)}
                        </span>
                        <button
                          onClick={() => handleDownload(file.fileName)}
                          disabled={isExpired}
                          className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-3 py-1 rounded-md text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                        >
                          <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
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
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-gray-500 text-xs sm:text-sm px-4">
              Need help? The download code is usually 6 or 8 characters long
              (e.g., ABC123, ABCD1234)
            </p>
          </div>
        </div>
      </main>
    </>
  );
}

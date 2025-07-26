"use client";
import { useState, useCallback } from "react";
import { Upload, File, X, Download, Copy, Clock } from "lucide-react";
import Navbar from "../Component/nav";
import { toast } from "sonner";

export default function ClientPage() {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([
    {
      id: "1",
      name: "presentation.pdf",
      size: 2048000,
      uploadDate: new Date(Date.now() - 3600000),
      downloadUrl: "https://example.com/download/1",
      expiresIn: "23h",
    },
    {
      id: "2",
      name: "image.jpg",
      size: 1024000,
      uploadDate: new Date(Date.now() - 7200000),
      downloadUrl: "https://example.com/download/2",
      expiresIn: "21h",
    },
  ]);

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  }, []);

  const handleFileInput = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return (
      Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
    );
  };

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    // TODO: Use sooner here
    toast.info("Link copied to clipboard!");
  };

  const uploadFiles = () => {
    // TODO: API call here
    alert(`${files.length} file(s) uploaded successfully!`);
    setFiles([]);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-8 mt-20">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
              Secure File Upload
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Share files anonymously and securely. Files are automatically
              deleted after 24 hours.
            </p>
          </div>

          {/* Upload Area Card */}
          <div className="mb-8 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 md:p-12 text-center transition-colors ${
                  dragActive
                    ? "border-gray-300 bg-gray-700"
                    : "border-gray-600 hover:border-gray-500 bg-gray-900"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto h-12 w-12 text-gray-500 mb-4" />
                <p className="text-lg font-medium text-gray-200 mb-2">
                  Drag and drop files here
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  or click to browse files
                </p>
                <div className="pointer-events-none bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 px-4 py-2 rounded-md text-sm font-medium inline-flex items-center">
                  Choose Files
                </div>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-white mb-3">
                    Selected Files ({files.length})
                  </h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center space-x-3 min-w-0 flex-1">
                          <File className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white truncate">
                              {file.name}
                            </p>
                            <p className="text-xs text-gray-400">
                              {formatFileSize(file.size)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-1 hover:bg-gray-700 text-gray-400 hover:text-white rounded-md transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={uploadFiles}
                    className="w-full mt-4 bg-gray-700 text-white hover:bg-gray-600 border-0 px-4 py-2 rounded-md font-medium transition-colors"
                  >
                    Upload {files.length} File{files.length !== 1 ? "s" : ""}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Uploaded Files Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="flex items-center space-x-2 text-white text-lg font-semibold">
                <Clock className="h-5 w-5 text-gray-400" />
                <span>Recently Uploaded Files</span>
              </h2>
            </div>
            <div className="p-6">
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-400 text-center py-8">
                  No files uploaded yet
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
                            {file.name}
                          </p>
                          <div className="flex items-center space-x-4 text-xs text-gray-400">
                            <span>{formatFileSize(file.size)}</span>
                            <span>
                              {file.uploadDate.toLocaleDateString()} at{" "}
                              {file.uploadDate.toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <span className="text-xs bg-gray-600 text-gray-200 border border-gray-500 hover:bg-gray-500 px-2 py-1 rounded-md">
                          Expires in {file.expiresIn}
                        </span>
                        <button
                          onClick={() => copyToClipboard(file.downloadUrl)}
                          className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-3 py-1 rounded-md text-sm font-medium inline-flex items-center transition-colors"
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy Link
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

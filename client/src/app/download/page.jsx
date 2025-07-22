"use client"
import { useState } from "react"
import { Download, File, Clock, Shield, AlertCircle, CheckCircle } from "lucide-react"

export default function ClientPage() {
  const [downloadCode, setDownloadCode] = useState("")
  const [fileInfo, setFileInfo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [downloaded, setDownloaded] = useState(false)

  // Mock file database
  const mockFiles = {
    ABC123: {
      id: "1",
      name: "presentation.pdf",
      size: 2048000,
      uploadDate: new Date(Date.now() - 3600000),
      expiresAt: new Date(Date.now() + 20 * 3600000), // 20 hours from now
      downloadCount: 0,
      type: "application/pdf",
    },
    XYZ789: {
      id: "2",
      name: "image.jpg",
      size: 1024000,
      uploadDate: new Date(Date.now() - 7200000),
      expiresAt: new Date(Date.now() + 16 * 3600000), // 16 hours from now
      downloadCount: 3,
      type: "image/jpeg",
    },
    DEF456: {
      id: "3",
      name: "expired-file.zip",
      size: 5120000,
      uploadDate: new Date(Date.now() - 25 * 3600000),
      expiresAt: new Date(Date.now() - 1 * 3600000), // Expired 1 hour ago
      downloadCount: 0,
      type: "application/zip",
    },
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTimeRemaining = (expiresAt) => {
    const now = new Date()
    const timeLeft = expiresAt - now

    if (timeLeft <= 0) return "Expired"

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!downloadCode.trim()) {
      setError("Please enter a download code or link")
      return
    }

    setLoading(true)
    setError("")
    setFileInfo(null)

    // TODO: API call here
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Extract code from URL if full link is pasted
    let code = downloadCode.trim()
    if (code.includes("/download/")) {
      code = code.split("/download/")[1]
    }
    if (code.includes("?code=")) {
      code = code.split("?code=")[1]
    }

    const file = mockFiles[code.toUpperCase()]

    if (!file) {
      setError("Invalid download code. Please check and try again.")
      setLoading(false)
      return
    }

    if (new Date() > file.expiresAt) {
      setError("This file has expired and is no longer available for download.")
      setLoading(false)
      return
    }

    if (file.downloadCount >= file.maxDownloads) {
      setError("This file has reached its maximum download limit.")
      setLoading(false)
      return
    }

    setFileInfo(file)
    setLoading(false)
  }

  const handleDownload = () => {
    // Simulate file download
    alert(`Downloading ${fileInfo.name}...`)
    setDownloaded(true)

    // Update download count
    setFileInfo((prev) => ({
      ...prev,
      downloadCount: prev.downloadCount + 1,
    }))
  }

  const getFileIcon = (type) => {
    if (type.startsWith("image/")) return "🖼️"
    if (type.includes("pdf")) return "📄"
    if (type.includes("zip") || type.includes("rar")) return "📦"
    if (type.includes("video/")) return "🎥"
    if (type.includes("audio/")) return "🎵"
    return "📁"
  }

  return (
    <main className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">Download File</h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto">
            Enter your download code or paste the shared link to access your file.
          </p>
        </div>

        {/* Download Code Input */}
        <div className="mb-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="downloadCode" className="block text-sm font-medium text-gray-200 mb-2">
                  Download Code or Link
                </label>
                <input
                  type="text"
                  id="downloadCode"
                  value={downloadCode}
                  onChange={(e) => setDownloadCode(e.target.value)}
                  placeholder="Enter code (e.g., ABC123) or paste full link"
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
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

        {/* File Information */}
        {fileInfo && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-700">
              <h2 className="flex items-center space-x-2 text-white text-lg font-semibold">
                <File className="h-5 w-5 text-gray-400" />
                <span>File Information</span>
              </h2>
            </div>
            <div className="p-6">
              <div className="flex items-start space-x-4 mb-6">
                <div className="text-4xl">{getFileIcon(fileInfo.type)}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-semibold text-white mb-2 truncate">{fileInfo.name}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="font-medium">Size:</span> {formatFileSize(fileInfo.size)}
                    </div>
                    <div>
                      <span className="font-medium">Type:</span> {fileInfo.type}
                    </div>
                    <div>
                      <span className="font-medium">Uploaded:</span> {fileInfo.uploadDate.toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Expiration Warning */}
              <div className="flex items-center space-x-2 p-3 bg-gray-800 border border-gray-600 rounded-lg mb-6">
                <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <div className="text-sm">
                  <span className="text-gray-300">Expires in: </span>
                  <span className="text-white font-medium">{getTimeRemaining(fileInfo.expiresAt)}</span>
                </div>
              </div>

              {/* Download Button */}
              <div className="space-y-3">
                <button
                  onClick={handleDownload}
                  className="w-full bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="h-5 w-5" />
                  <span>
                    Download
                  </span>
                </button>

                {downloaded && (
                  <div className="flex items-center justify-center space-x-2 text-green-400 text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Download started successfully!</span>
                  </div>
                )}
              </div>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-gray-800 border border-gray-600 rounded-lg">
                <div className="flex items-start space-x-2">
                  <Shield className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-gray-400">
                    <p className="font-medium text-gray-300 mb-1">Security Notice</p>
                    <p>
                      This file will be automatically deleted after expiration. Downloads are limited and tracked for
                      security purposes.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Need help? The download code is usually 6 characters long (e.g., ABC123)
          </p>
        </div>
      </div>
    </main>
  )
}

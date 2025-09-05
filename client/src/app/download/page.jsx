"use client"
import { useState } from "react"
import { Download, File, Clock, Shield, AlertCircle, DownloadCloud } from "lucide-react"
import Navbar from "../Component/nav"
import Loading from "../Component/loading"
import { toast } from "sonner"

export default function ClientPage() {
  const [downloadCode, setDownloadCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [downloaded, setDownloaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [downloadingAll, setDownloadingAll] = useState(false)

  const VITE_HOST =
    process.env.NEXT_PUBLIC_NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
      : process.env.NEXT_PUBLIC_BACKEND_LOCAL

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isExpired, setIsExpired] = useState(false)

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getTimeRemaining = (createdAt, lifeSpan) => {
    const created = new Date(createdAt)
    const expiresAt = new Date(created.getTime() + lifeSpan * 60 * 60 * 1000)
    const now = new Date()
    const timeLeft = expiresAt - now

    if (timeLeft <= 0) {
      setIsExpired(true)
      return "Expired"
    }

    const hours = Math.floor(timeLeft / (1000 * 60 * 60))
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `Expires in ${hours}h ${minutes}m`
    }
    return `Expires in ${minutes}m`
  }

  const extractCode = (urlString) => {
    try {
      const url = new URL(urlString)
      const segments = url.pathname.split("/").filter(Boolean)
      return segments[segments.length - 1]
    } catch (err) {
      setError("Invalid code or link")
      return
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!downloadCode.trim()) {
      setError("Please enter a download code or link")
      return
    }
    setLoading(true)
    setError("")
    let code = downloadCode

    if (downloadCode.length !== 6 && downloadCode.length !== 8) {
      code = extractCode(downloadCode)
    }

    // API call here
    if (code.length === 6) {
      try {
        setIsLoading(true)
        const response = await fetch(`${VITE_HOST}/api/file/getFile?code=${code}`, {
          method: "GET",
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setUploadedFiles([])
          setUploadedFiles([...data.uploadedFilesResponse])
          setDownloaded(false)
        } else {
          setUploadedFiles([])
          setError("No files found for the provided code.")
        }
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.error("Error fetching files: ", err)
      }
    } else if (code.length === 8) {
      try {
        setIsLoading(true)
        const response = await fetch(`${VITE_HOST}/api/file/getFolder?code=${code}`, {
          method: "GET",
        })
        const data = await response.json()
        if (response.ok && data.success) {
          setUploadedFiles([])
          setUploadedFiles([...data.uploadedFilesResponse])
          setDownloaded(false)
        } else {
          setUploadedFiles([])
          setError("No files found for the provided code.")
        }
        setIsLoading(false)
      } catch (err) {
        setIsLoading(false)
        console.error("Error fetching files: ", err)
      }
    } else {
      setUploadedFiles([])
      setError("Invalid code. Please enter a valid code.")
    }
    setDownloadCode("")
    setLoading(false)
  }

  const handleDownload = async (fileName) => {
    toast.info(`Downloading...`)
    try {
      setIsLoading(true)
      const response = await fetch(`${VITE_HOST}/api/file/downloadFile/${fileName}`, {
        method: "GET",
      })
      if (!response.ok) {
        const data = await response.json()
        toast.error(data.message || "Failed to download file")
      } else {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = fileName
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
        toast.success(`File downloaded successfully!`)
      }
      setIsLoading(false)
    } catch (err) {
      console.log("Error downloading file: ", err)
      toast.error("Failed to download file")
    }
    setDownloaded(true)
  }

  const handleDownloadAll = async () => {
    if (uploadedFiles.length === 0) {
      toast.error("No files to download")
      return
    }

    if (isExpired) {
      toast.error("Files have expired")
      return
    }

    setDownloadingAll(true)
    toast.info(`Downloading ${uploadedFiles.length} files...`)

    try {
      let successCount = 0
      let failCount = 0

      for (const file of uploadedFiles) {
        try {
          const response = await fetch(`${VITE_HOST}/api/file/downloadFile/${file.fileName}`, {
            method: "GET",
          })

          if (response.ok) {
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement("a")
            a.href = url
            a.download = file.fileName
            document.body.appendChild(a)
            a.click()
            a.remove()
            window.URL.revokeObjectURL(url)
            successCount++

            // Small delay between downloads to prevent overwhelming the browser
            await new Promise((resolve) => setTimeout(resolve, 500))
          } else {
            failCount++
          }
        } catch (err) {
          console.error(`Error downloading ${file.fileName}:`, err)
          failCount++
        }
      }

      if (successCount > 0) {
        toast.success(`Successfully downloaded ${successCount} file(s)${failCount > 0 ? `, ${failCount} failed` : ""}`)
      } else {
        toast.error("Failed to download files")
      }
    } catch (err) {
      console.error("Error in download all:", err)
      toast.error("Failed to download files")
    } finally {
      setDownloadingAll(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      <Navbar />
      <main className="min-h-screen bg-black caret-transparent selection:text-black selection:bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8 mt-16 sm:mt-20 animate-fade-in-up">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">
              Download File
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-xl mx-auto px-4">
              Enter your download code or paste the shared link to access your file.
            </p>
          </div>

          {/* Download Code Input */}
          <div className="mb-6 sm:mb-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg animate-fade-in-up delay-200">
            <div className="p-4 sm:p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="downloadCode" className="block text-xs sm:text-sm font-medium text-gray-200 mb-2">
                    Download Code or Link
                  </label>
                  <input
                    type="text"
                    id="downloadCode"
                    value={downloadCode}
                    onChange={(e) => setDownloadCode(e.target.value)}
                    placeholder="Enter code"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500 caret-white text-sm sm:text-base"
                  />
                </div>
                {error && (
                  <div className="flex items-center space-x-2 text-red-400 text-xs sm:text-sm">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 px-4 py-2 sm:py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
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

          {/* Available Files Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg animate-fade-in-up delay-400">
            <div className="p-4 sm:p-6 border-b border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="flex items-center space-x-2 text-white text-base sm:text-lg font-semibold">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <span>Available Files</span>
              </h2>
              {uploadedFiles.length > 0 && (
                <button
                  onClick={handleDownloadAll}
                  disabled={downloadingAll || isExpired}
                  className="bg-gray-700 text-white hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-500 px-3 sm:px-4 py-2 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-xs sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {downloadingAll ? (
                    <>
                      <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-2 border-gray-400 border-t-white"></div>
                      <span>Downloading...</span>
                    </>
                  ) : (
                    <>
                      <DownloadCloud className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Download All</span>
                    </>
                  )}
                </button>
              )}
            </div>
            <div className="p-4 sm:p-6">
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No files available</p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-800 border border-gray-700 rounded-lg space-y-3 sm:space-y-0"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                        <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{file.fileName}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-gray-400 space-y-1 sm:space-y-0">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-center gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
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
          <div className="mt-6 sm:mt-8 text-center animate-fade-in-up delay-600">
            <p className="text-gray-500 text-xs sm:text-sm px-4">
              Need help? The download code is usually 6 or 8 characters long (e.g., ABC123, ABCD1234)
            </p>
          </div>
        </div>
      </main>
    </>
  )
}

"use client"
import { useState, useCallback, useEffect } from "react"
import { Upload, File, X, Copy, Clock, Calendar } from "lucide-react"
import Navbar from "../component/nav.jsx"
import Loading from "../component/loading.jsx"
import { toast } from "sonner"

export default function ClientPage() {
  const [dragActive, setDragActive] = useState(false)
  const [files, setFiles] = useState([])
  const [expiryDate, setExpiryDate] = useState(24)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [folderCode, setFolderCode] = useState("")

  const VITE_HOST =
    process.env.NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_BACKEND_HOSTED
      : process.env.NEXT_PUBLIC_BACKEND_LOCAL

  const frontend =
    process.env.NODE_ENV == "production"
      ? process.env.NEXT_PUBLIC_FRONTEND_HOSTED
      : process.env.NEXT_PUBLIC_FRONTEND_LOCAL

  const folderLink = `${frontend}/download/${folderCode}`

  useEffect(() => {
    const code = uploadedFiles.length > 0 ? uploadedFiles[0].folder : ""
    setFolderCode(code)
  }, [uploadedFiles])

  useEffect(() => {
    // DONE: Fetch uploaded files as per session
    const getUploadedFiles = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${VITE_HOST}/api/file/getOwnerFolder`, {
          method: "GET",
          credentials: "include",
        })
        const data = await response.json()
        if (response.ok && data.success && data.uploadedFilesResponse && data.uploadedFilesResponse.length > 0) {
          setUploadedFiles([...data.uploadedFilesResponse])
        }
        setIsLoading(false)
      } catch (error) {
        setIsLoading(false)
        console.error("Error fetching data: ", error)
      }
    }
    getUploadedFiles()
  }, [])

  const uploadFiles = async () => {
    toast.info("Uploading files")
    const formData = new FormData()
    for (const file of files) {
      formData.append("files", file)
    }
    formData.append("lifeSpan", expiryDate)

    try {
      setIsLoading(true)
      const response = await fetch(`${VITE_HOST}/api/file/uploadFiles`, {
        method: "POST",
        credentials: "include",
        body: formData,
      })
      const data = await response.json()
      if (response.ok && data.success) {
        toast.success(data.message || "Files uploaded successfully")
        if (data.uploadedFilesResponse && data.uploadedFilesResponse.length > 0) {
          setUploadedFiles((prev) => [...data.uploadedFilesResponse, ...prev])
        }
      } else {
        toast.error(data.message || "Failed to upload files")
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      toast.error("Failed to upload files. Please try again later")
      console.log("Upload error:", err)
    }
    setFiles([])
  }

  // Expiry options
  const expiryOptions = [
    { value: 1, label: "1 Hour" },
    { value: 6, label: "6 Hours" },
    { value: 12, label: "12 Hours" },
    { value: 24, label: "24 Hours" },
    { value: 48, label: "48 Hours" },
    { value: 168, label: "7 Days" },
  ]

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }, [])

  const handleFileInput = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setFiles((prev) => [...prev, ...newFiles])
    }
  }

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url)
    toast.info("Copied to clipboard!")
  }

  return (
    <>
      {isLoading && <Loading />}
      <Navbar />
      <main className="min-h-screen bg-black pt-16 caret-transparent selection:text-black selection:bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4 px-2">
              Secure File Upload
            </h1>
            <p className="text-gray-400 text-xs sm:text-sm md:text-base max-w-2xl mx-auto px-4">
              Share files anonymously and securely. Files are automatically deleted after the selected expiry time.
            </p>
          </div>

          {/* Upload Area Card */}
          <div className="mb-6 sm:mb-8 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-4 sm:p-6">
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 sm:p-8 md:p-12 text-center transition-colors ${
                  dragActive ? "border-gray-300 bg-gray-700" : "border-gray-600 hover:border-gray-500 bg-gray-900"
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
                <Upload className="mx-auto h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 text-gray-500 mb-3 sm:mb-4" />
                <p className="text-base sm:text-lg font-medium text-gray-200 mb-1 sm:mb-2">Drag and drop files here</p>
                <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">or click to browse files</p>
                <div className="pointer-events-none bg-gray-800 border border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white hover:border-gray-500 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium inline-flex items-center">
                  Choose Files
                </div>
              </div>

              {/* Expiry Date Selection */}
              <div className="mt-4 sm:mt-6">
                <label htmlFor="expiryDate" className="block text-xs sm:text-sm font-medium text-gray-200 mb-2">
                  <Calendar className="inline h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  File Expiry Time
                </label>
                <select
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(Number(e.target.value))}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                >
                  {expiryOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-800 text-white">
                      {option.label}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-gray-400 mt-1">
                  Files will be automatically deleted after the selected time period
                </p>
              </div>

              {/* Selected Files */}
              {files.length > 0 && (
                <div className="mt-4 sm:mt-6">
                  <h3 className="font-medium text-white mb-3 text-sm sm:text-base">Selected Files ({files.length})</h3>
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 sm:p-3 bg-gray-800 rounded-lg border border-gray-700"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                          <File className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs sm:text-sm font-medium text-white truncate">{file.name}</p>
                            <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => removeFile(index)}
                          className="flex-shrink-0 p-1 hover:bg-gray-700 text-gray-400 hover:text-white rounded-md transition-colors ml-2"
                        >
                          <X className="h-3 w-3 sm:h-4 sm:w-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Upload Summary */}
                  <div className="mt-4 p-2 sm:p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs sm:text-sm space-y-1 sm:space-y-0">
                      <span className="text-gray-300">
                        {files.length} file{files.length !== 1 ? "s" : ""} selected
                      </span>
                      <span className="text-gray-300">
                        Expires in:{" "}
                        <span className="text-white font-medium">
                          {expiryOptions.find((opt) => opt.value === expiryDate)?.label}
                        </span>
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={uploadFiles}
                    className="w-full mt-4 bg-gray-700 text-white hover:bg-gray-600 border-0 px-4 py-2 sm:py-3 rounded-md font-medium transition-colors text-sm sm:text-base"
                  >
                    Upload {files.length} File{files.length !== 1 ? "s" : ""}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Recently Uploaded Files Card */}
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                <h2 className="flex items-center space-x-2 text-white text-base sm:text-lg font-semibold">
                  <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <span>Recently Uploaded Files</span>
                </h2>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                  <button
                    onClick={() => copyToClipboard(folderLink)}
                    className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors w-full sm:w-auto"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">
                      {folderCode.length == 8 ? `Folder's Link` : "Generating Link"}
                    </span>
                    <span className="sm:hidden">{folderCode.length == 8 ? `Link` : "Gen..."}</span>
                  </button>
                  <button
                    onClick={() => copyToClipboard(folderCode)}
                    className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors w-full sm:w-auto"
                  >
                    <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    <span className="hidden sm:inline">
                      {folderCode.length == 8 ? `Folder: ${folderCode}` : "Generating code"}
                    </span>
                    <span className="sm:hidden">{folderCode.length == 8 ? folderCode : "Gen..."}</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4 sm:p-6">
              {uploadedFiles.length === 0 ? (
                <p className="text-gray-400 text-center py-6 sm:py-8 text-sm sm:text-base">No files uploaded yet</p>
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
                          <p className="text-xs sm:text-sm font-medium text-white truncate">{file.fileName}</p>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 text-xs text-gray-400 space-y-1 sm:space-y-0">
                            <span>{formatFileSize(file.size)}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-end gap-2 flex-shrink-0 w-full sm:w-auto mt-3 sm:mt-0">
                        <span className="text-xs bg-gray-600 text-gray-200 border border-gray-500 hover:bg-gray-500 px-2 py-1 rounded-md whitespace-nowrap w-full text-center sm:w-auto">
                          Expires in {file.lifeSpan == 168 ? 7 : file.lifeSpan}
                          {file.lifeSpan == 168 ? "d" : "h"}
                        </span>
                        <button
                          onClick={() => copyToClipboard(file.downloadUrl)}
                          className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors w-full sm:w-auto"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="hidden sm:inline">Copy Link</span>
                          <span className="sm:hidden">Link</span>
                        </button>
                        <button
                          onClick={() => copyToClipboard(file.code)}
                          className="border border-gray-600 text-gray-300 hover:bg-gray-600 hover:text-white bg-gray-800 hover:border-gray-500 px-2 sm:px-3 py-1 rounded-md text-xs sm:text-sm font-medium inline-flex items-center justify-center transition-colors w-full sm:w-auto"
                        >
                          <Copy className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                          <span className="truncate max-w-16 sm:max-w-none">{file.code}</span>
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
  )
}

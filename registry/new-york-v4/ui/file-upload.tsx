"use client"

import { useEffect, useState } from "react"
import {
  CircleAlertIcon,
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  UploadIcon,
  VideoIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from "@/hooks/use-file-upload"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface FileUploadItem extends FileWithPreview {
  progress: number
  status: "uploading" | "completed" | "error"
  error?: string
}

interface FileUploadProps {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  className?: string
  onFilesChange?: (files: FileWithPreview[]) => void
  simulateUpload?: boolean
}

function getFileIcon(file: File | FileMetadata) {
  const type = file.type
  if (type.startsWith("image/")) return <ImageIcon className="size-4" />
  if (type.startsWith("video/")) return <VideoIcon className="size-4" />
  if (type.startsWith("audio/")) return <HeadphonesIcon className="size-4" />
  if (type.includes("pdf") || type.includes("word") || type.includes("doc"))
    return <FileTextIcon className="size-4" />
  if (type.includes("excel") || type.includes("sheet"))
    return <FileSpreadsheetIcon className="size-4" />
  if (type.includes("zip") || type.includes("rar"))
    return <FileArchiveIcon className="size-4" />
  return <FileTextIcon className="size-4" />
}

export function FileUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024,
  accept = "*",
  multiple = true,
  className,
  onFilesChange,
  simulateUpload = true,
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([])

  const [{ isDragging, errors }, { removeFile, clearFiles, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, openFileDialog, getInputProps }] =
    useFileUpload({
      maxFiles,
      maxSize,
      accept,
      multiple,
      onFilesChange: (newFiles) => {
        setUploadFiles((prev) =>
          newFiles.map((file) => {
            const existing = prev.find((e) => e.id === file.id)
            return existing ? { ...existing, ...file } : { ...file, progress: 0, status: "uploading" as const }
          })
        )
        onFilesChange?.(newFiles)
      },
    })

  useEffect(() => {
    if (!simulateUpload) return
    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== "uploading") return file
          const newProgress = Math.min(file.progress + Math.random() * 15 + 5, 100)
          if (newProgress > 50 && Math.random() < 0.1)
            return { ...file, status: "error" as const, error: "Upload failed. Please try again." }
          if (newProgress >= 100)
            return { ...file, progress: 100, status: "completed" as const }
          return { ...file, progress: newProgress }
        })
      )
    }, 500)
    return () => clearInterval(interval)
  }, [simulateUpload])

  const retryUpload = (id: string) =>
    setUploadFiles((prev) =>
      prev.map((f) => f.id === id ? { ...f, progress: 0, status: "uploading" as const, error: undefined } : f)
    )

  const removeUploadFile = (id: string) => {
    setUploadFiles((prev) => prev.filter((f) => f.id !== id))
    removeFile(id)
  }

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <div
        className={cn(
          "relative rounded-lg border border-dashed p-8 text-center transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-muted-foreground/50"
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />
        <div className="flex flex-col items-center gap-4">
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-full", isDragging ? "bg-primary/10" : "bg-muted")}>
            <UploadIcon className={cn("h-6", isDragging ? "text-primary" : "text-muted-foreground")} />
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Upload your files</h3>
            <p className="text-muted-foreground text-sm">Drag and drop files here or click to browse</p>
            <p className="text-muted-foreground text-xs">Up to {formatBytes(maxSize)} each</p>
          </div>
          <Button type="button" onClick={openFileDialog}>
            <UploadIcon className="h-4 w-4" />
            Select files
          </Button>
        </div>
      </div>

      {uploadFiles.length > 0 && (
        <div className="mt-6 flex items-center justify-between">
          <h4 className="text-sm font-medium">
            Upload Progress ({uploadFiles.filter((f) => f.status === "completed").length}/{uploadFiles.length} done)
          </h4>
          <Button onClick={clearFiles} variant="outline" size="sm">Clear all</Button>
        </div>
      )}

      {uploadFiles.length > 0 && (
        <div className="mt-4 space-y-3">
          {uploadFiles.map((fileItem) => (
            <div key={fileItem.id} className="border-border bg-card rounded-lg border p-2.5">
              <div className="flex items-start gap-2.5">
                <div className="shrink-0">
                  {fileItem.preview && fileItem.file.type.startsWith("image/") ? (
                    <img src={fileItem.preview} alt={fileItem.file.name} className="rounded-lg h-12 w-12 border object-cover" />
                  ) : (
                    <div className="border-border text-muted-foreground rounded-lg flex h-12 w-12 items-center justify-center border">
                      {getFileIcon(fileItem.file)}
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="inline-flex flex-col gap-1 truncate font-medium">
                      <span className="text-sm">{fileItem.file.name}</span>
                      <span className="text-muted-foreground text-xs">{formatBytes(fileItem.file.size)}</span>
                    </p>
                    <Button onClick={() => removeUploadFile(fileItem.id)} variant="ghost" size="icon" className="text-muted-foreground size-6 hover:bg-transparent">
                      <XIcon className="size-4" />
                    </Button>
                  </div>
                  {fileItem.status === "uploading" && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}
                  {fileItem.status === "error" && fileItem.error && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-destructive">
                      <CircleAlertIcon className="size-3.5 shrink-0" />
                      <span>{fileItem.error}</span>
                      <Button onClick={() => retryUpload(fileItem.id)} variant="ghost" size="icon" className="ml-auto size-5 text-muted-foreground">
                        <RefreshCwIcon className="size-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {errors.length > 0 && (
        <Alert variant="destructive" className="mt-5">
          <CircleAlertIcon />
          <AlertTitle>Upload error</AlertTitle>
          <AlertDescription>
            {errors.map((e, i) => <p key={i}>{e}</p>)}
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}

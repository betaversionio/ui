import {
  FileTextIcon,
  FileSpreadsheetIcon,
  FileArchiveIcon,
  FileIcon,
  ImageIcon,
  DownloadIcon,
  XIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

function getFileInfo(url: string) {
  const filename = decodeURIComponent(
    url.split("/").pop()?.split("?")[0] ?? "file"
  )
  const cleanName = filename.replace(/^\d{10,}-/, "")
  const ext = cleanName.split(".").pop()?.toLowerCase() ?? ""
  return { filename: cleanName, ext }
}

function isImageExt(ext: string) {
  return ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "avif"].includes(ext)
}

function getFileIcon(ext: string) {
  if (["pdf"].includes(ext))
    return <FileTextIcon className="size-5 text-red-500" />
  if (["doc", "docx"].includes(ext))
    return <FileTextIcon className="size-5 text-blue-500" />
  if (["ppt", "pptx"].includes(ext))
    return <FileTextIcon className="size-5 text-orange-500" />
  if (["xls", "xlsx", "csv"].includes(ext))
    return <FileSpreadsheetIcon className="size-5 text-emerald-500" />
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return <FileArchiveIcon className="size-5 text-amber-500" />
  if (isImageExt(ext))
    return <ImageIcon className="size-5 text-violet-500" />
  return <FileIcon className="size-5 text-muted-foreground" />
}

interface AttachmentPreviewProps {
  url: string
  onRemove?: () => void
  className?: string
}

export function AttachmentPreview({ url, onRemove, className }: AttachmentPreviewProps) {
  const { filename, ext } = getFileInfo(url)
  const isImage = isImageExt(ext)

  return (
    <div
      className={cn(
        "group/attachment relative flex items-center gap-2.5 rounded-lg border border-border bg-card p-2 transition-colors hover:bg-muted/50",
        className
      )}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 min-w-0 flex-1"
      >
        {isImage ? (
          <img
            src={url}
            alt={filename}
            className="h-10 w-10 rounded-md object-cover border border-border shrink-0"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted shrink-0">
            {getFileIcon(ext)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground truncate">{filename}</p>
          <p className="text-[10px] uppercase text-muted-foreground">{ext || "file"}</p>
        </div>
        <DownloadIcon className="size-3.5 text-muted-foreground shrink-0" />
      </a>
      {onRemove && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove() }}
          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover/attachment:opacity-100 transition-opacity"
        >
          <XIcon className="size-3" />
        </button>
      )}
    </div>
  )
}

interface AttachmentPreviewListProps {
  urls: string[]
  onRemove?: (index: number) => void
  className?: string
}

export function AttachmentPreviewList({ urls, onRemove, className }: AttachmentPreviewListProps) {
  if (urls.length === 0) return null
  return (
    <div className={cn("grid gap-2", className)}>
      {urls.map((url, i) => (
        <AttachmentPreview
          key={i}
          url={url}
          onRemove={onRemove ? () => onRemove(i) : undefined}
        />
      ))}
    </div>
  )
}

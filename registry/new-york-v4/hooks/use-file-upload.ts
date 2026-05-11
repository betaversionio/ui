"use client"

import type React from "react"
import {
  useCallback,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type InputHTMLAttributes,
} from "react"

export type FileMetadata = {
  name: string
  size: number
  type: string
  url: string
  id: string
}

export type FileWithPreview = {
  file: File | FileMetadata
  id: string
  preview?: string
}

export type FileUploadOptions = {
  maxFiles?: number
  maxSize?: number
  accept?: string
  multiple?: boolean
  initialFiles?: FileMetadata[]
  onFilesChange?: (files: FileWithPreview[]) => void
  onFilesAdded?: (addedFiles: FileWithPreview[]) => void
  onError?: (errors: string[]) => void
}

export type FileUploadState = {
  files: FileWithPreview[]
  isDragging: boolean
  errors: string[]
}

export type FileUploadActions = {
  addFiles: (files: FileList | File[]) => void
  removeFile: (id: string) => void
  clearFiles: () => void
  clearErrors: () => void
  handleDragEnter: (e: DragEvent<HTMLElement>) => void
  handleDragLeave: (e: DragEvent<HTMLElement>) => void
  handleDragOver: (e: DragEvent<HTMLElement>) => void
  handleDrop: (e: DragEvent<HTMLElement>) => void
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void
  openFileDialog: () => void
  getInputProps: (
    props?: InputHTMLAttributes<HTMLInputElement>
  ) => InputHTMLAttributes<HTMLInputElement> & { ref: React.Ref<HTMLInputElement> }
}

export const useFileUpload = (
  options: FileUploadOptions = {}
): [FileUploadState, FileUploadActions] => {
  const {
    maxFiles = Number.POSITIVE_INFINITY,
    maxSize = Number.POSITIVE_INFINITY,
    accept = "*",
    multiple = false,
    initialFiles = [],
    onFilesChange,
    onFilesAdded,
    onError,
  } = options

  const [state, setState] = useState<FileUploadState>({
    files: initialFiles.map((file) => ({ file, id: file.id, preview: file.url })),
    isDragging: false,
    errors: [],
  })

  const inputRef = useRef<HTMLInputElement>(null)

  const validateFile = useCallback(
    (file: File | FileMetadata): string | null => {
      if (file.size > maxSize) {
        return `File "${file.name}" exceeds the maximum size of ${formatBytes(maxSize)}.`
      }
      if (accept !== "*") {
        const acceptedTypes = accept.split(",").map((t) => t.trim())
        const fileType = file instanceof File ? file.type || "" : file.type
        const fileExt = `.${file.name.split(".").pop()}`
        const isAccepted = acceptedTypes.some((type) => {
          if (type.startsWith(".")) return fileExt.toLowerCase() === type.toLowerCase()
          if (type.endsWith("/*")) return fileType.startsWith(`${type.split("/")[0]}/`)
          return fileType === type
        })
        if (!isAccepted) return `File "${file.name}" is not an accepted file type.`
      }
      return null
    },
    [accept, maxSize]
  )

  const createPreview = useCallback((file: File | FileMetadata): string | undefined => {
    if (file instanceof File) return URL.createObjectURL(file)
    return file.url
  }, [])

  const generateId = useCallback((file: File | FileMetadata): string => {
    if (file instanceof File)
      return `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    return file.id
  }, [])

  const clearFiles = useCallback(() => {
    setState((prev) => {
      for (const f of prev.files) {
        if (f.preview && f.file instanceof File && f.file.type.startsWith("image/")) {
          URL.revokeObjectURL(f.preview)
        }
      }
      if (inputRef.current) inputRef.current.value = ""
      const newState = { ...prev, files: [], errors: [] }
      onFilesChange?.(newState.files)
      return newState
    })
  }, [onFilesChange])

  const addFiles = useCallback(
    (newFiles: FileList | File[]) => {
      if (!newFiles || newFiles.length === 0) return
      const arr = Array.from(newFiles)
      const errors: string[] = []
      setState((prev) => ({ ...prev, errors: [] }))
      if (!multiple) clearFiles()
      if (multiple && maxFiles !== Number.POSITIVE_INFINITY && state.files.length + arr.length > maxFiles) {
        const e = [`You can only upload a maximum of ${maxFiles} files.`]
        onError?.(e)
        setState((prev) => ({ ...prev, errors: e }))
        return
      }
      const validFiles: FileWithPreview[] = []
      for (const file of arr) {
        if (multiple && state.files.some((f) => f.file.name === file.name && f.file.size === file.size)) continue
        const err = validateFile(file)
        if (err) { errors.push(err) } else {
          validFiles.push({ file, id: generateId(file), preview: createPreview(file) })
        }
      }
      if (validFiles.length > 0) {
        onFilesAdded?.(validFiles)
        setState((prev) => {
          const files = !multiple ? validFiles : [...prev.files, ...validFiles]
          onFilesChange?.(files)
          return { ...prev, files, errors }
        })
      } else if (errors.length > 0) {
        onError?.(errors)
        setState((prev) => ({ ...prev, errors }))
      }
      if (inputRef.current) inputRef.current.value = ""
    },
    [state.files, maxFiles, multiple, maxSize, validateFile, createPreview, generateId, clearFiles, onFilesChange, onFilesAdded]
  )

  const removeFile = useCallback(
    (id: string) => {
      setState((prev) => {
        const f = prev.files.find((f) => f.id === id)
        if (f?.preview && f.file instanceof File && f.file.type.startsWith("image/")) {
          URL.revokeObjectURL(f.preview)
        }
        const files = prev.files.filter((f) => f.id !== id)
        onFilesChange?.(files)
        return { ...prev, files, errors: [] }
      })
    },
    [onFilesChange]
  )

  const clearErrors = useCallback(() => setState((prev) => ({ ...prev, errors: [] })), [])
  const handleDragEnter = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); setState((p) => ({ ...p, isDragging: true })) }, [])
  const handleDragLeave = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation(); if (!e.currentTarget.contains(e.relatedTarget as Node)) setState((p) => ({ ...p, isDragging: false })) }, [])
  const handleDragOver = useCallback((e: DragEvent<HTMLElement>) => { e.preventDefault(); e.stopPropagation() }, [])
  const handleDrop = useCallback((e: DragEvent<HTMLElement>) => {
    e.preventDefault(); e.stopPropagation()
    setState((p) => ({ ...p, isDragging: false }))
    if (inputRef.current?.disabled) return
    if (e.dataTransfer.files?.length > 0) {
      addFiles(!multiple ? [e.dataTransfer.files[0]] : e.dataTransfer.files)
    }
  }, [addFiles, multiple])
  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) addFiles(e.target.files)
  }, [addFiles])
  const openFileDialog = useCallback(() => inputRef.current?.click(), [])
  const getInputProps = useCallback(
    (props: InputHTMLAttributes<HTMLInputElement> = {}) => ({
      ...props, type: "file" as const, onChange: handleFileChange,
      accept: props.accept || accept,
      multiple: props.multiple !== undefined ? props.multiple : multiple,
      ref: inputRef,
    }),
    [accept, multiple, handleFileChange]
  )

  return [state, { addFiles, removeFile, clearFiles, clearErrors, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileChange, openFileDialog, getInputProps }]
}

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes"
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Number.parseFloat((bytes / k ** i).toFixed(dm)) + " " + sizes[i]
}

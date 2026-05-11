"use client"

import type { FormEvent, ReactNode } from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  submitLabel: string
  isPending?: boolean
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  children: ReactNode
  className?: string
}

export function FormDialog({
  open,
  onOpenChange,
  title,
  submitLabel,
  isPending,
  onSubmit,
  children,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl",
          className
        )}
      >
        <DialogHeader className="border-b px-6 py-4">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={onSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            {children}
          </div>
          <DialogFooter className="border-t px-6 py-4">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            {submitLabel && (
              <Button type="submit" size="sm" disabled={isPending}>
                {isPending && <Spinner className="mr-1 size-3.5" />}
                {submitLabel}
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

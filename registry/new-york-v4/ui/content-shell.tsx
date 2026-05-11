"use client"

import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

interface ContentShellBaseProps {
  title?: string
  description?: string
  icon?: ReactNode
  actions?: ReactNode
  children: ReactNode
  className?: string
}

interface ContentShellInlineProps extends ContentShellBaseProps {
  mode?: "page" | "tab" | "section"
  open?: never
  onOpenChange?: never
}

interface ContentShellOverlayProps extends ContentShellBaseProps {
  mode: "drawer" | "modal"
  open: boolean
  onOpenChange: (open: boolean) => void
}

export type ContentShellProps = ContentShellInlineProps | ContentShellOverlayProps

function ContentShellHeader({
  icon,
  title,
  description,
  actions,
}: Pick<ContentShellBaseProps, "icon" | "title" | "description" | "actions">) {
  if (!title && !description && !icon && !actions) return null
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          {icon && <span className="shrink-0">{icon}</span>}
          {title && (
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
          )}
        </div>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}

export function ContentShell(props: ContentShellProps) {
  const { mode = "page", title, description, icon, actions, children, className } = props

  if (mode === "drawer") {
    const { open, onOpenChange } = props as ContentShellOverlayProps
    return (
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="flex flex-col gap-0 p-0">
          <SheetHeader className="border-b px-6 py-4">
            <div className="flex items-start justify-between gap-4 pr-8">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  {icon && <span className="shrink-0">{icon}</span>}
                  <SheetTitle>{title}</SheetTitle>
                </div>
                {description && (
                  <SheetDescription className="mt-1">{description}</SheetDescription>
                )}
              </div>
              {actions && <div className="shrink-0">{actions}</div>}
            </div>
          </SheetHeader>
          <div className={cn("flex-1 overflow-y-auto p-6", className)}>
            {children}
          </div>
        </SheetContent>
      </Sheet>
    )
  }

  if (mode === "modal") {
    const { open, onOpenChange } = props as ContentShellOverlayProps
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
          <DialogHeader className="border-b px-6 py-4">
            <div className="flex items-center gap-2">
              {icon && <span className="shrink-0">{icon}</span>}
              <DialogTitle>{title}</DialogTitle>
            </div>
            {description && (
              <DialogDescription className="mt-1">{description}</DialogDescription>
            )}
          </DialogHeader>
          <div className={cn("flex-1 overflow-y-auto p-6", className)}>
            {children}
          </div>
          {actions && (
            <div className="flex justify-end gap-2 border-t px-6 py-4">
              {actions}
            </div>
          )}
        </DialogContent>
      </Dialog>
    )
  }

  if (mode === "section") {
    return (
      <div className={cn("bg-card rounded-xl border border-border p-5 space-y-4", className)}>
        <ContentShellHeader icon={icon} title={title} description={description} actions={actions} />
        {children}
      </div>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      <ContentShellHeader icon={icon} title={title} description={description} actions={actions} />
      {children}
    </div>
  )
}

ContentShell.displayName = "ContentShell"

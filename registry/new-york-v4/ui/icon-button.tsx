"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const iconButtonVariants = cva(
  "inline-flex items-center justify-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "text-muted-foreground hover:text-foreground hover:bg-muted",
        ghost: "text-muted-foreground hover:text-foreground",
        destructive:
          "text-muted-foreground hover:text-destructive hover:bg-destructive/10",
      },
      size: {
        default: "h-9 w-9",
        sm: "h-7 w-7",
        lg: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface IconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
)
IconButton.displayName = "IconButton"

export { IconButton, iconButtonVariants }

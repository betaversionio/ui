import React from "react"

import { cn } from "@/lib/utils"

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) => (
  <div
    className={cn(
      "mx-auto grid max-w-7xl grid-cols-1 gap-4 md:auto-rows-[18rem] md:grid-cols-3",
      className
    )}
  >
    {children}
  </div>
)

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
}: {
  className?: string
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  header?: React.ReactNode
  icon?: React.ReactNode
}) => (
  <div
    className={cn(
      "group/bento row-span-1 flex flex-col justify-between space-y-4 rounded-xl border border-border/50 bg-card p-4 shadow-sm transition duration-200 hover:shadow-xl dark:shadow-none",
      className
    )}
  >
    {header}
    <div className="transition duration-200 group-hover/bento:translate-x-2">
      {icon}
      <div className="mb-2 mt-2 font-sans font-bold text-foreground">
        {title}
      </div>
      <div className="font-sans text-xs font-normal text-muted-foreground">
        {description}
      </div>
    </div>
  </div>
)

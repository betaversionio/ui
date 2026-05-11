import { cn } from "@/lib/utils"

interface HeroBackgroundProps {
  children: React.ReactNode
  className?: string
  as?: "div" | "section"
}

export function HeroBackground({
  children,
  className,
  as: Tag = "div",
}: HeroBackgroundProps) {
  return (
    <Tag className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--foreground)/0.06),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,hsl(var(--foreground)/0.1),transparent_55%)]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage: `
            linear-gradient(to right, hsl(var(--foreground) / 0.04) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--foreground) / 0.04) 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
        }}
      />
      <div className="relative z-10">{children}</div>
    </Tag>
  )
}

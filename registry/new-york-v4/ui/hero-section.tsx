import { cn } from "@/lib/utils"
import { HeroBackground } from "@/components/ui/hero-background"

interface HeroSectionProps {
  title?: string
  highlightedText?: string
  description?: string
  children?: React.ReactNode
  className?: string
}

export function HeroSection({
  title,
  highlightedText,
  description,
  children,
  className,
}: HeroSectionProps) {
  return (
    <HeroBackground
      as="section"
      className={cn("border-b py-20 md:py-28", className)}
    >
      {title && (
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            {title}{" "}
            {highlightedText && (
              <span className="text-primary">{highlightedText}</span>
            )}
          </h1>
          {description && (
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}
      {children}
    </HeroBackground>
  )
}

"use client"

import { useEffect, useState, useCallback } from "react"
import { AnimatePresence, motion } from "motion/react"

import { cn } from "@/lib/utils"

interface ContainerTextFlipProps {
  words?: string[]
  interval?: number
  className?: string
  textClassName?: string
  animationDuration?: number
}

export function ContainerTextFlip({
  words = ["better", "modern", "beautiful", "awesome"],
  interval = 3000,
  className,
  textClassName,
  animationDuration = 700,
}: ContainerTextFlipProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [width, setWidth] = useState(0)

  const updateWidth = useCallback(() => {
    const element = document.getElementById("text-flip-measure")
    if (element) setWidth(element.offsetWidth)
  }, [])

  useEffect(() => {
    updateWidth()
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % words.length)
    }, interval)
    return () => clearInterval(timer)
  }, [words.length, interval, updateWidth])

  useEffect(() => {
    updateWidth()
  }, [currentIndex, updateWidth])

  return (
    <span className={cn("inline-flex items-center", className)}>
      <span
        id="text-flip-measure"
        className={cn("absolute invisible whitespace-nowrap", textClassName)}
      >
        {words[currentIndex]}
      </span>
      <motion.span
        className="inline-flex overflow-hidden rounded-lg bg-primary/10 px-2 py-1 backdrop-blur-sm dark:bg-primary/15"
        animate={{ width: width + 16 }}
        transition={{ duration: animationDuration / 1000, ease: [0.4, 0, 0.2, 1] }}
      >
        <AnimatePresence mode="wait">
          <motion.span
            key={currentIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: animationDuration / 1000 / 2, ease: "easeInOut" }}
            className={cn("whitespace-nowrap text-primary", textClassName)}
          >
            {words[currentIndex]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  )
}

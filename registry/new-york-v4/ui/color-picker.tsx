"use client"

import { forwardRef, useMemo, useState, useRef, useEffect } from "react"
import { HexAlphaColorPicker } from "react-colorful"

import { cn } from "@/lib/utils"
import { type ButtonProps, Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"

interface ColorPickerProps {
  value: string
  onChange: (value: string) => void
  onBlur?: () => void
}

const ColorPicker = forwardRef<
  HTMLInputElement,
  Omit<ButtonProps, "value" | "onChange" | "onBlur"> & ColorPickerProps
>(({ disabled, value, onChange, onBlur, name, className, ...props }, forwardedRef) => {
  const innerRef = useRef<HTMLInputElement>(null)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (typeof forwardedRef === "function") {
      forwardedRef(innerRef.current)
    } else if (forwardedRef) {
      forwardedRef.current = innerRef.current
    }
  }, [forwardedRef])

  const parsedValue = useMemo(() => value || "#FFFFFF", [value])

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger asChild disabled={disabled} onBlur={onBlur}>
        <Button
          {...props}
          className={cn("block h-10 w-10 rounded-lg border-2 p-0", className)}
          name={name}
          onClick={() => setOpen(true)}
          size="icon"
          variant="outline"
        >
          <div
            className="h-full w-full rounded-md"
            style={{
              backgroundColor: parsedValue,
              backgroundImage:
                "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)",
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
          >
            <div
              className="h-full w-full rounded-md"
              style={{ backgroundColor: parsedValue }}
            />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto space-y-3 p-3" align="start">
        <HexAlphaColorPicker color={parsedValue} onChange={onChange} />
        <Input
          maxLength={9}
          onChange={(e) => onChange(e.currentTarget.value)}
          ref={innerRef}
          value={parsedValue}
          className="font-mono text-sm"
        />
      </PopoverContent>
    </Popover>
  )
})
ColorPicker.displayName = "ColorPicker"

export { ColorPicker }

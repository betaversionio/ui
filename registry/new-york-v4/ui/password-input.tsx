"use client"

import * as React from "react"
import { Eye, EyeOff } from "lucide-react"

import { Input } from "@/components/ui/input"

const PasswordInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof Input>, "type">
>(({ className, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <Input
        type={showPassword ? "text" : "password"}
        className={`pr-10 ${className ?? ""}`}
        ref={ref}
        {...props}
      />
      <button
        type="button"
        className="absolute right-0 top-0 flex h-full items-center px-3 text-muted-foreground hover:text-foreground transition-colors"
        onClick={() => setShowPassword((prev) => !prev)}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }

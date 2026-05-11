"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

dayjs.extend(customParseFormat)

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
]

type DatePickerMode = "full" | "month-year" | "year"

interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  fromYear?: number
  toYear?: number
  mode?: DatePickerMode
  className?: string
}

const FORMAT_MAP: Record<DatePickerMode, { display: string; input: string }> = {
  full: { display: "MMM D, YYYY", input: "DD/MM/YYYY" },
  "month-year": { display: "MMM YYYY", input: "MM/YYYY" },
  year: { display: "YYYY", input: "YYYY" },
}

export function DatePicker({
  value,
  onChange,
  placeholder,
  disabled,
  fromYear = 1970,
  toYear = new Date().getFullYear() + 10,
  mode = "full",
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)
  const [inputError, setInputError] = React.useState(false)

  const date = React.useMemo(
    () => (value ? new Date(value) : undefined),
    [value]
  )

  const [viewYear, setViewYear] = React.useState(
    () => date?.getFullYear() ?? new Date().getFullYear()
  )
  const [viewMonth, setViewMonth] = React.useState(
    () => date?.getMonth() ?? new Date().getMonth()
  )

  const prevValueRef = React.useRef(value)
  React.useEffect(() => {
    if (value !== prevValueRef.current && date) {
      setViewYear(date.getFullYear())
      setViewMonth(date.getMonth())
    }
    prevValueRef.current = value
  }, [value, date])

  const calendarMonth = React.useMemo(
    () => new Date(viewYear, viewMonth, 1),
    [viewYear, viewMonth]
  )

  const fmt = FORMAT_MAP[mode]
  const defaultPlaceholder = placeholder ?? fmt.input

  const displayValue = isFocused
    ? inputValue
    : date
      ? dayjs(date).format(fmt.display)
      : ""

  const years = React.useMemo(() => {
    const arr: number[] = []
    for (let y = toYear; y >= fromYear; y--) arr.push(y)
    return arr
  }, [fromYear, toYear])

  function emitDate(d: Date) {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, "0")
    const day = String(d.getDate()).padStart(2, "0")
    onChange?.(`${y}-${m}-${day}`)
  }

  function autoSlash(raw: string): string {
    const digits = raw.replace(/\D/g, "")
    if (mode === "full") {
      if (digits.length <= 2) return digits
      if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`
      return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`
    }
    if (mode === "month-year") {
      if (digits.length <= 2) return digits
      return `${digits.slice(0, 2)}/${digits.slice(2, 6)}`
    }
    return digits.slice(0, 4)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(autoSlash(e.target.value))
    setInputError(false)
  }

  function handleInputFocus() {
    setIsFocused(true)
    setInputValue(date ? dayjs(date).format(fmt.input) : "")
    setInputError(false)
  }

  function handleInputBlur() {
    setIsFocused(false)
    if (!inputValue.trim()) { setInputError(false); return }
    const parsed = dayjs(inputValue, fmt.input, true)
    if (parsed.isValid()) {
      emitDate(parsed.toDate())
      setInputError(false)
    } else {
      setInputError(true)
    }
  }

  function handleInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault()
      ;(e.target as HTMLInputElement).blur()
    }
  }

  function handleMonthSelect(val: string) {
    const m = Number(val)
    setViewMonth(m)
    if (mode === "month-year") { emitDate(new Date(viewYear, m, 1)); setOpen(false) }
  }

  function handleYearSelect(val: string) {
    const y = Number(val)
    setViewYear(y)
    if (mode === "year") { emitDate(new Date(y, 0, 1)); setOpen(false) }
    if (mode === "month-year") emitDate(new Date(y, viewMonth, 1))
  }

  return (
    <div className={cn("relative", className)}>
      <Input
        value={displayValue}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        onKeyDown={handleInputKeyDown}
        placeholder={defaultPlaceholder}
        disabled={disabled}
        className={cn(
          "pr-9",
          !date && !isFocused && "text-muted-foreground",
          inputError && "border-destructive"
        )}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
          >
            <CalendarIcon className="h-4 w-4" />
          </button>
        </PopoverTrigger>
        {open && (
          <PopoverContent className="w-auto p-0" align="end">
            <div className="flex items-center justify-between gap-2 px-3 pt-3">
              {mode !== "year" && (
                <Select value={String(viewMonth)} onValueChange={handleMonthSelect}>
                  <SelectTrigger className="h-8 flex-1 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MONTHS.map((m, i) => (
                      <SelectItem key={i} value={String(i)}>{m}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <Select value={String(viewYear)} onValueChange={handleYearSelect}>
                <SelectTrigger className={cn("h-8 text-xs", mode === "year" ? "w-full" : "w-[90px]")}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {years.map((y) => (
                    <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {mode === "full" && (
              <Calendar
                mode="single"
                selected={date}
                month={calendarMonth}
                onMonthChange={(d) => { setViewYear(d.getFullYear()); setViewMonth(d.getMonth()) }}
                hideNavigation
                classNames={{ month_caption: "hidden" }}
                onSelect={(d) => {
                  if (d) emitDate(d)
                  else onChange?.("")
                  setOpen(false)
                }}
              />
            )}
          </PopoverContent>
        )}
      </Popover>
    </div>
  )
}

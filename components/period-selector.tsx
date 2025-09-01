"use client"

import * as React from "react"
import { defaultRangeForPeriod, type DateRange, type Period } from "@/lib/date"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import { toISODate } from "@/lib/date"

type Props = {
  period: Period
  onPeriodChange: (p: Period) => void
  range: DateRange
  onRangeChange: (r: DateRange) => void
}

// 🔹 Helper to generate period labels
function getPeriodLabel(period: Period): string {
  const now = new Date()
  if (period === "month") {
    return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`
  }
  if (period === "week") {
    const week = Math.ceil(now.getDate() / 7)
    return `Week ${week}, ${now.toLocaleString("default", { month: "long" })}`
  }
  return ""
}

export function PeriodSelector({ period, onPeriodChange, range, onRangeChange }: Props) {
  React.useEffect(() => {
    if (period !== "custom") {
      onRangeChange(defaultRangeForPeriod(period))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period])

  const [fromOpen, setFromOpen] = React.useState(false)
  const [toOpen, setToOpen] = React.useState(false)

  return (
    <div className={`flex gap-4 ${period === "custom" ? "items-start" : "items-end"}`}>
      {/* Period Dropdown */}
      <div className="grid gap-2">
        <Label htmlFor="period">Period</Label>
        <Select value={period} onValueChange={(v) => onPeriodChange(v as Period)}>
          <SelectTrigger id="period" className="w-[160px]">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Dynamic label for non-custom */}
      {period !== "custom" && (
        <div className="text-sm text-muted-foreground pb-2">
          {getPeriodLabel(period)}
        </div>
      )}

      {/* Only show date pickers when Custom is selected */}
      {period === "custom" && (
        <div className="grid grid-cols-1 gap-4">
          {/* From Picker */}
          <div className="grid gap-2">
            <Label htmlFor="from">From</Label>
            <Popover open={fromOpen} onOpenChange={setFromOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  id="from"
                  variant="outline"
                  className="justify-start text-left font-normal bg-transparent"
                  onClick={() => setFromOpen(true)}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {range.from || "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={range.from ? new Date(range.from) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      onRangeChange({ ...range, from: toISODate(d) })
                      setFromOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* To Picker */}
          <div className="grid gap-2">
            <Label htmlFor="to">To</Label>
            <Popover open={toOpen} onOpenChange={setToOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  id="to"
                  variant="outline"
                  className="justify-start text-left font-normal bg-transparent"
                  onClick={() => setToOpen(true)}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {range.to || "Pick date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={range.to ? new Date(range.to) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      onRangeChange({ ...range, to: toISODate(d) })
                      setToOpen(false)
                    }
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      )}
    </div>
  )
}

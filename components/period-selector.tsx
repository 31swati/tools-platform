"use client"

import * as React from "react"
import { defaultRangeForPeriod, type DateRange, type Period } from "@/lib/date"
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

function getPeriodLabel(period: Period): string {
  const now = new Date()
  if (period === "month") {
    return `${now.toLocaleString("default", { month: "long" })} ${now.getFullYear()}`
  }
  if (period === "week") {
    const week = Math.ceil(now.getDate() / 7)
    return `Week ${week}, ${now.toLocaleString("default", { month: "short" })}`
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
    <div className="flex items-center gap-2">
      {/* Period dropdown */}
      <Select value={period} onValueChange={(v) => onPeriodChange(v as Period)}>
        <SelectTrigger className="w-[130px] h-8 text-sm">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>

      {/* Period label for non-custom */}
      {period !== "custom" && (
        <span className="text-sm text-muted-foreground whitespace-nowrap">
          {getPeriodLabel(period)}
        </span>
      )}

      {/* Inline compact date pickers for custom */}
      {period === "custom" && (
        <>
          <Popover open={fromOpen} onOpenChange={setFromOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-sm gap-1.5 font-normal"
                onClick={() => setFromOpen(true)}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {range.from || "From"}
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
              />
            </PopoverContent>
          </Popover>

          <span className="text-muted-foreground text-sm">→</span>

          <Popover open={toOpen} onOpenChange={setToOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 text-sm gap-1.5 font-normal"
                onClick={() => setToOpen(true)}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                {range.to || "To"}
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
              />
            </PopoverContent>
          </Popover>
        </>
      )}
    </div>
  )
}

"use client"

import * as React from "react"
import { useViews, useCategories, useExpenses } from "@/lib/storage"
import { isWithinRange, type DateRange } from "@/lib/date"
import { useSettings } from "@/lib/storage"
import { currencySymbol } from "@/lib/currency"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { emojiFor } from "@/lib/emoji"

type Props = {
  range: DateRange
}

export function AggregationPanel({ range }: Props) {
  const { data: views = [] } = useViews()
  const { data: categories = [] } = useCategories()
  const { data: expenses = [] } = useExpenses()
  const { data: settings } = useSettings()

  const [viewId, setViewId] = React.useState<string>("")

  React.useEffect(() => {
    if (!viewId && views.length > 0) setViewId(views[0].id)
  }, [views, viewId])

  const cats = categories.filter((c) => c.viewId === viewId)
  const [selectedCats, setSelectedCats] = React.useState<string[]>([])

  React.useEffect(() => {
    setSelectedCats([])
  }, [viewId])

  const toggleCat = (id: string, checked: boolean | string) => {
    setSelectedCats((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((c) => c !== id)))
  }

  const relevant = expenses.filter(
    (e) =>
      e.viewId === viewId &&
      isWithinRange(e.date, range) &&
      (selectedCats.length === 0 || selectedCats.includes(e.categoryId)),
  )
  const total = relevant.reduce((acc, e) => acc + e.amount, 0)
  const symbol = settings ? currencySymbol(settings.currency) : "₹"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Aggregate by Selected Subcategories</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label>View</Label>
          <Select value={viewId} onValueChange={setViewId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a view" />
            </SelectTrigger>
            <SelectContent>
              {views.map((v) => (
                <SelectItem key={v.id} value={v.id}>
                  {emojiFor(v.name)} {v.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-2">
          <Label>Select subcategories to include</Label>
          <div className="grid gap-1.5 md:grid-cols-2">
            {cats.length === 0 && (
              <p className="text-sm text-muted-foreground">No subcategories yet</p>
            )}
            {cats.map((c) => {
              const checked = selectedCats.includes(c.id)
              return (
                <label
                  key={c.id}
                  className="flex items-center gap-2.5 text-sm px-3 py-2 rounded-lg cursor-pointer select-none
                    bg-muted/40 hover:bg-muted/80 border border-transparent hover:border-border transition-colors"
                >
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => toggleCat(c.id, v)}
                    className="border-border"
                  />
                  {emojiFor(c.name)} {c.name}
                </label>
              )
            })}
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Aggregated total:{" "}
          <span className="font-semibold text-foreground text-base">
            {symbol}
            {total.toFixed(2)}
          </span>
          {selectedCats.length > 0 && (
            <span className="ml-2 text-xs">
              ({selectedCats.length} subcategor{selectedCats.length === 1 ? "y" : "ies"} selected)
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { useExpenses, useViews, useCategories, deleteExpense } from "@/lib/storage"
import { isWithinRange, type DateRange } from "@/lib/date"
import { currencySymbol } from "@/lib/currency"
import { useSettings } from "@/lib/storage"
import type { Expense } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import { ViewSelect } from "@/components/view-select"
import { CategorySelect } from "@/components/category-select"
import { emojiFor } from "@/lib/emoji"
import { Badge } from "@/components/ui/badge"

type Props = {
  range: DateRange
  onEdit?: (e: Expense) => void
  onNavigateToManage?: () => void
}

const PAGE_SIZE_OPTIONS = [25, 50, 100, 500]

export function ExpenseTable({ range, onEdit, onNavigateToManage }: Props) {
  const { data: expenses = [] } = useExpenses()
  const { data: views = [] } = useViews()
  const { data: categories = [] } = useCategories()
  const { data: settings } = useSettings()

  const [viewFilter, setViewFilter] = React.useState<string>("all")
  const [catFilter, setCatFilter] = React.useState<string>("all")
  const [search, setSearch] = React.useState<string>("")
  const [filterOpen, setFilterOpen] = React.useState(false)
  const [page, setPage] = React.useState(0)
  const [pageSize, setPageSize] = React.useState(25)

  const activeFilterCount = (viewFilter !== "all" ? 1 : 0) + (catFilter !== "all" ? 1 : 0)

  const clearFilters = () => {
    setViewFilter("all")
    setCatFilter("all")
  }

  // Reset to first page whenever filters/search/range change
  React.useEffect(() => {
    setPage(0)
  }, [viewFilter, catFilter, search, range])

  const filtered = expenses.filter((e) => {
    if (!isWithinRange(e.date, range)) return false
    if (viewFilter !== "all" && e.viewId !== viewFilter) return false
    if (catFilter !== "all" && e.categoryId !== catFilter) return false
    if (search.trim()) {
      const v = views.find((v) => v.id === e.viewId)?.name || ""
      const c = categories.find((c) => c.id === e.categoryId)?.name || ""
      const text = `${v} ${c} ${e.note || ""}`.toLowerCase()
      if (!text.includes(search.toLowerCase())) return false
    }
    return true
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, totalPages - 1)
  const paginated = filtered.slice(safePage * pageSize, (safePage + 1) * pageSize)

  const total = filtered.reduce((acc, e) => acc + e.amount, 0)
  const symbol = settings ? currencySymbol(settings.currency) : "₹"

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-balance">Expenses</CardTitle>

          <div className="flex items-center gap-2">
            <Input
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-40 h-8 text-sm"
            />

            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5 h-8">
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  Filter
                  {activeFilterCount > 0 && (
                    <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-xs h-4">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="w-64 grid gap-4 p-4">
                <div className="grid gap-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    View
                  </Label>
                  <ViewSelect
                    value={viewFilter}
                    onValueChange={(v) => {
                      setViewFilter(v)
                      setCatFilter("all")
                    }}
                    includeAll
                    onAddNew={() => {
                      setFilterOpen(false)
                      onNavigateToManage?.()
                    }}
                  />
                </div>
                <div className="grid gap-2">
                  <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Subcategory
                  </Label>
                  <CategorySelect
                    value={catFilter}
                    onValueChange={setCatFilter}
                    filterByViewId={viewFilter === "all" ? undefined : viewFilter}
                    includeAll
                    onAddNew={() => {
                      setFilterOpen(false)
                      onNavigateToManage?.()
                    }}
                  />
                </div>
                {activeFilterCount > 0 && (
                  <Button variant="ghost" size="sm" className="w-full gap-1" onClick={clearFilters}>
                    <X className="w-3.5 h-3.5" /> Clear filters
                  </Button>
                )}
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        {/* Summary + page size row */}
        <div className="flex items-center justify-between text-sm text-muted-foreground flex-wrap gap-2">
          <span>
            Total:{" "}
            <span className="font-medium text-foreground">
              {symbol}{total.toFixed(2)}
            </span>
            {filtered.length > 0 && (
              <span className="ml-2 text-xs">
                ({filtered.length} {filtered.length === 1 ? "entry" : "entries"})
              </span>
            )}
          </span>
          <div className="flex items-center gap-1.5 text-xs">
            <span>Show</span>
            <Select
              value={String(pageSize)}
              onValueChange={(v) => {
                setPageSize(Number(v))
                setPage(0)
              }}
            >
              <SelectTrigger className="h-7 w-[68px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((n) => (
                  <SelectItem key={n} value={String(n)} className="text-xs">
                    {n}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>per page</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>View</TableHead>
                <TableHead>Subcategory</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginated.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              )}
              {paginated.map((e) => {
                const vName = views.find((v) => v.id === e.viewId)?.name || "—"
                const cName = categories.find((c) => c.id === e.categoryId)?.name || "—"
                return (
                  <TableRow key={e.id}>
                    <TableCell>{e.date}</TableCell>
                    <TableCell>
                      {emojiFor(vName)} {vName}
                    </TableCell>
                    <TableCell>
                      {emojiFor(cName)} {cName}
                    </TableCell>
                    <TableCell className="text-right">
                      {symbol}{e.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="max-w-[20ch] truncate">{e.note || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="secondary" size="sm" className="mr-2" onClick={() => onEdit?.(e)}>
                        ✏️ Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => deleteExpense(e.id)}>
                        🗑
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>

        {/* Pagination controls – only shown when there's more than one page */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-1">
            <span className="text-xs text-muted-foreground">
              Page {safePage + 1} of {totalPages}
            </span>
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={safePage === 0}
                onClick={() => setPage(safePage - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {/* Show up to 5 page number buttons, centred around current page */}
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const startPage = Math.max(0, Math.min(safePage - 2, totalPages - 5))
                const pageNum = startPage + i
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === safePage ? "default" : "outline"}
                    size="sm"
                    className="h-7 w-7 p-0 text-xs"
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum + 1}
                  </Button>
                )
              })}

              <Button
                variant="outline"
                size="sm"
                className="h-7 w-7 p-0"
                disabled={safePage >= totalPages - 1}
                onClick={() => setPage(safePage + 1)}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import * as React from "react"
import { useExpenses, useViews, useCategories, deleteExpense } from "@/lib/storage"
import { isWithinRange, type DateRange } from "@/lib/date"
import { currencySymbol } from "@/lib/currency"
import { useSettings } from "@/lib/storage"
import { emojiFor } from "@/lib/emoji"
import type { Expense } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type Props = {
  range: DateRange
  onEdit?: (e: Expense) => void
}

export function ExpenseTable({ range, onEdit }: Props) {
  const { data: expenses = [] } = useExpenses()
  const { data: views = [] } = useViews()
  const { data: categories = [] } = useCategories()
  const { data: settings } = useSettings()

  const [viewFilter, setViewFilter] = React.useState<string>("all")
  const [catFilter, setCatFilter] = React.useState<string>("all")
  const [search, setSearch] = React.useState<string>("")


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

  const total = filtered.reduce((acc, e) => acc + e.amount, 0)
  const symbol = settings ? currencySymbol(settings.currency) : "₹"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-balance">Expenses</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-3 md:grid-cols-4">
          <div className="grid gap-2">
            <Label>View</Label>
            <Select
              value={viewFilter}
              onValueChange={(v) => {
                setViewFilter(v)
                setCatFilter("all")
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Views</SelectItem>
                {views.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Subcategory</Label>
            <Select value={catFilter} onValueChange={setCatFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by subcategory" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {categories
                  .filter((c) => viewFilter === "all" || c.viewId === viewFilter)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2 md:col-span-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search notes, view or subcategory"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Total: {symbol}
          {total.toFixed(2)}
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
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No expenses found
                  </TableCell>
                </TableRow>
              )}
              {filtered.map((e) => {
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
                      {symbol}
                      {e.amount.toFixed(2)}
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
      </CardContent>
    </Card>
  )
}

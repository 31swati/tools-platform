"use client"

import * as React from "react"
import { ensureSeedData, useSettings, setSettings } from "@/lib/storage"
import { currencies, currencySymbol } from "@/lib/currency"
import { defaultRangeForPeriod, type DateRange, type Period } from "@/lib/date"
import { ExpenseForm } from "@/components/expense-form"
import { PeriodSelector } from "@/components/period-selector"
import { ExpenseTable } from "@/components/expense-table"
import { ViewManager } from "@/components/view-manager"
import { AggregationPanel } from "@/components/aggregation-panel"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SlidersHorizontal } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"

export default function Page() {
  // Seed initial data
  React.useEffect(() => {
    ensureSeedData()
  }, [])

  const { data: settings } = useSettings()
  const symbol = settings ? currencySymbol(settings.currency) : "₹"

  const [period, setPeriod] = React.useState<Period>("month")
  const [range, setRange] = React.useState<DateRange>(defaultRangeForPeriod("month"))

  const exportCSV = () => {
    const rows: string[] = []
    rows.push(["id", "date", "viewId", "categoryId", "amount", "note"].join(","))
    try {
      const raw = localStorage.getItem("et_expenses") || "[]"
      const list = JSON.parse(raw) as any[]
      list.forEach((e) => {
        rows.push([e.id, e.date, e.viewId, e.categoryId, e.amount, (e.note || "").replace(/,/g, ";")].join(","))
      })
      const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "expenses.csv"
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // ignore
    }
  }

  return (
    <main className="container mx-auto max-w-5xl p-4 md:p-6">
      <header className="mb-6 flex flex-col gap-4 md:items-center md:justify-between md:flex-row">
        <h1 className="text-2xl font-semibold text-balance">Expense Tracker</h1>
        <div className="flex items-center gap-3">
          <Select value={settings?.currency} onValueChange={(v) => setSettings({ currency: v as any })}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </header>

      {/* 🔹 Filters Popover */}
      <div className="mb-6 flex justify-end">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              size="lg"
              className="rounded-full px-6 py-3 text-lg flex items-center gap-2 shadow-md 
                         bg-primary text-white hover:bg-primary/90"
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-[400px] p-4">
            <PeriodSelector
              period={period}
              onPeriodChange={setPeriod}
              range={range}
              onRangeChange={setRange}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Tabs defaultValue="overview" className="grid gap-6">
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview" className="w-full md:w-auto">
            All Expenses
          </TabsTrigger>
          <TabsTrigger value="aggregate" className="w-full md:w-auto">
            Aggregate (per view)
          </TabsTrigger>
          <TabsTrigger value="manage" className="w-full md:w-auto">
            Manage Views & Subcategories
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="grid gap-6">
          <ExpenseTable range={range} />
        </TabsContent>

        <TabsContent value="aggregate" className="grid gap-6">
          <AggregationPanel range={range} />
        </TabsContent>

        <TabsContent value="manage" className="grid gap-6">
          <ViewManager />
        </TabsContent>
      </Tabs>

      {/* 🔹 Floating Add Expense Button */}
      <div className="fixed bottom-6 right-6">
        <ExpenseForm />
      </div>
    </main>
  )
}

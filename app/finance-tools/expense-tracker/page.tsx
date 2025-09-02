"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import { DateRange, defaultRangeForPeriod, Period } from "@/lib/date"
import { useSettings, setSettings } from "@/lib/storage"
import { currencySymbol } from "@/lib/currency"
import { ExpenseForm } from "@/components/expense-form"
import { PeriodSelector } from "@/components/period-selector"
import { ExpenseTable } from "@/components/expense-table"
import { AggregationPanel } from "@/components/aggregation-panel"
import { ViewManager } from "@/components/view-manager"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import Link from "next/link"
import { useRouter } from "next/navigation"


import { Currency, Expense } from "@/lib/types"

export default function Page() {
  const { data: settings } = useSettings()
  const [range, setRange] = useState<DateRange>(
    defaultRangeForPeriod("month")
  )
  const [period, setPeriod] = useState<Period>("month")
  const [showForm, setShowForm] = useState(false)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const router = useRouter()

  useEffect(() => {
  const seen = localStorage.getItem("expenseTrackerWelcome")
  
  if (!seen) {
    setShowWelcome(true)
    localStorage.setItem("expenseTrackerWelcome", "true")
  }
  }, [])

  return (
    <div className="container mx-auto p-4 space-y-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
        <div className="flex gap-3">
            {/* Back button */}
            <Button variant="outline" onClick={() => router.back()}>
            ← Back
            </Button>

            {/* Home button */}
            <Link href="/">
            <Button variant="outline">🏠 Home</Button>
            </Link>
        </div>

        <CardTitle className="text-2xl font-bold">Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4 mb-4">
            <Select
            value={settings?.currency || "INR"}
            onValueChange={(value) => {
                setSettings({ currency: value as Currency }) }}
            >
            <SelectTrigger className="w-[150px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="INR">INR (₹)</SelectItem>
                <SelectItem value="USD">USD ($)</SelectItem>
                <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
            </Select>
            <Button
              variant="outline"
              onClick={() => {
                /* export CSV handler */
              }}
            >
              Export CSV
            </Button>
            <PeriodSelector
            period={period}
            onPeriodChange={setPeriod}   // ✅ correct
            range={range}
            onRangeChange={setRange}
            />
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">All Expenses</TabsTrigger>
              <TabsTrigger value="aggregate">Aggregate (per view)</TabsTrigger>
              <TabsTrigger value="manage">Manage Views & Subcategories</TabsTrigger>
            </TabsList>

            {/* All Expenses */}
            <TabsContent value="overview" className="grid gap-6">
              <ExpenseTable range={range}
              onEdit={(expense) => setEditingExpense(expense)} />

              {/* ✅ Add Expense button is right below the last row */}
              <div className="flex justify-center">
                <ExpenseForm
                  editing={editingExpense}
                  onDone={() => setEditingExpense(null)}
                />
              </div>

              <div className="flex justify-end">
                <Button
                    asChild
                    className="px-6 py-3 text-lg flex items-center gap-2 bg-amber-600 text-white hover:bg-amber-700 shadow-md"
                >
                    <a
                    href="https://forms.gle/iqzD4xesojRWtrks6"
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    💬 Feedback
                    </a>
                </Button>
                </div>

            </TabsContent>

            {/* Aggregate Tab */}
            <TabsContent value="aggregate" className="grid gap-6">
              <AggregationPanel range={range} />
            </TabsContent>

            {/* Manage Views */}
            <TabsContent value="manage" className="grid gap-6">
              <ViewManager />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <Dialog open={showWelcome} onOpenChange={setShowWelcome}>
        <DialogContent>
            <DialogHeader>
            <DialogTitle>Welcome to Expense Tracker 🎉</DialogTitle>
            </DialogHeader>
            <p>
            This expense tracker currently saves data locally on your computer.  
            We are working on a version where you will be able to create an account and save your data in the cloud,  
            so you can access it across multiple devices.
            </p>
            <p className="mt-3 font-semibold">
            Please leave your feedback — we want this product to be part of your daily workflow ❤️
            </p>
            <DialogFooter>
            <Button onClick={() => setShowWelcome(false)}>Got it</Button>
            </DialogFooter>
        </DialogContent>
        </Dialog>

    </div>
  )
}

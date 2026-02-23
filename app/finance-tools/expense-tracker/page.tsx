"use client"

import * as React from "react"
import { useState } from "react"
import { DateRange, defaultRangeForPeriod, Period, isWithinRange } from "@/lib/date"
import { useSettings, setSettings, useExpenses, useCategories } from "@/lib/storage"
import { ExpenseForm } from "@/components/expense-form"
import { PeriodSelector } from "@/components/period-selector"
import { ExpenseTable } from "@/components/expense-table"
import { AggregationPanel } from "@/components/aggregation-panel"
import { ViewManager } from "@/components/view-manager"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, User, TrendingDown, Receipt, Tag, ArrowLeft, Home } from "lucide-react"
import { Currency, Expense } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"
import { StorageChoiceModal } from "@/components/storage-choice-modal"
import { AuthModal } from "@/components/auth-modal"
import { currencySymbol } from "@/lib/currency"
import { emojiFor } from "@/lib/emoji"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Page() {
  const { data: settings } = useSettings()
  const { user, storageMode, signOut } = useAuth()
  const { data: expenses = [] } = useExpenses()
  const { data: categories = [] } = useCategories()

  const [range, setRange] = useState<DateRange>(defaultRangeForPeriod("month"))
  const [period, setPeriod] = useState<Period>("month")
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const navigateToManage = () => setActiveTab("manage")
  const symbol = settings ? currencySymbol(settings.currency) : "₹"

  // Period stats
  const periodExpenses = expenses.filter((e) => isWithinRange(e.date, range))
  const totalSpent = periodExpenses.reduce((sum, e) => sum + e.amount, 0)
  const txCount = periodExpenses.length

  const catTotals = periodExpenses.reduce(
    (acc, e) => {
      acc[e.categoryId] = (acc[e.categoryId] || 0) + e.amount
      return acc
    },
    {} as Record<string, number>,
  )
  const topCatId = Object.entries(catTotals).sort((a, b) => b[1] - a[1])[0]?.[0]
  const topCat = categories.find((c) => c.id === topCatId)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <StorageChoiceModal open={storageMode === null} />
      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />

      {/* ── Top nav ── */}
      <header className="sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Home</span>
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span className="text-sm font-semibold tracking-tight text-slate-800 dark:text-slate-100">
              Expense Tracker
            </span>
          </div>

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="text-xs text-slate-500 hidden sm:block max-w-[150px] truncate">
                  {user.email}
                </span>
                <Button variant="outline" size="sm" onClick={() => signOut()} className="gap-1.5 border-slate-200 dark:border-slate-700">
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : storageMode === "local" ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="gap-1.5 border-slate-200 dark:border-slate-700"
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign in to sync</span>
              </Button>
            ) : null}
          </div>
        </div>
      </header>

      {/* ── Controls bar ── */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <div className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-2">
          <Select
            value={settings?.currency || "INR"}
            onValueChange={(v) => setSettings({ currency: v as Currency })}
          >
            <SelectTrigger className="w-[110px] h-8 text-sm border-slate-200 dark:border-slate-700">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
            </SelectContent>
          </Select>
          <Separator orientation="vertical" className="h-5 hidden sm:block bg-slate-200 dark:bg-slate-700" />
          <PeriodSelector
            period={period}
            onPeriodChange={setPeriod}
            range={range}
            onRangeChange={setRange}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* ── Theme toggle row ── */}
        <div className="flex justify-end">
          <ThemeToggle />
        </div>

        {/* ── Stat cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Total Spent */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col gap-1.5 border-l-4 border-l-emerald-500">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <TrendingDown className="w-3.5 h-3.5" /> Total Spent
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
              {symbol}
              {totalSpent.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>

          {/* Transactions */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col gap-1.5 border-l-4 border-l-blue-500">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Receipt className="w-3.5 h-3.5" /> Transactions
            </p>
            <p className="text-2xl font-bold tabular-nums tracking-tight text-slate-900 dark:text-slate-100">
              {txCount}
            </p>
          </div>

          {/* Top Category */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 flex flex-col gap-1.5 border-l-4 border-l-violet-500">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
              <Tag className="w-3.5 h-3.5" /> Top Category
            </p>
            <p className="text-2xl font-bold tracking-tight truncate text-slate-900 dark:text-slate-100">
              {topCat ? `${emojiFor(topCat.name)} ${topCat.name}` : "—"}
            </p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 h-10 mb-6 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="overview" className="text-sm">All Expenses</TabsTrigger>
            <TabsTrigger value="aggregate" className="text-sm">By View</TabsTrigger>
            <TabsTrigger value="manage" className="text-sm">Manage</TabsTrigger>
          </TabsList>

          {/* All Expenses */}
          <TabsContent value="overview" className="grid gap-6">
            <ExpenseTable
              range={range}
              onEdit={(expense) => setEditingExpense(expense)}
              onNavigateToManage={navigateToManage}
            />

            <div className="flex justify-center">
              <ExpenseForm
                editing={editingExpense}
                onDone={() => setEditingExpense(null)}
                onNavigateToManage={navigateToManage}
              />
            </div>

            <div className="flex justify-end">
              <Button
                asChild
                className="px-6 py-3 text-base flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white shadow-md"
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

          {/* By View */}
          <TabsContent value="aggregate">
            <AggregationPanel range={range} />
          </TabsContent>

          {/* Manage */}
          <TabsContent value="manage" className="space-y-6">
            <ViewManager />
            <div className="flex justify-end">
              <Button onClick={() => setActiveTab("overview")} className="gap-2">
                Done → All Expenses
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

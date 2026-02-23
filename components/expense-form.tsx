"use client"

import * as React from "react"
import { addExpense, updateExpense } from "@/lib/storage"
import type { Expense } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { toISODate } from "@/lib/date"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"
import { ViewSelect } from "@/components/view-select"
import { CategorySelect } from "@/components/category-select"
import { useViews, useCategories } from "@/lib/storage"

type Props = {
  editing?: Expense | null
  onDone?: () => void
  /** Called when user clicks "+ Add new view/subcategory" so the page can switch tabs */
  onNavigateToManage?: () => void
}

export function ExpenseForm({ editing, onDone, onNavigateToManage }: Props) {
  const { data: views = [] } = useViews()
  const { data: categories = [] } = useCategories()

  const [open, setOpen] = React.useState(false)

  const [viewId, setViewId] = React.useState<string>("")
  const [categoryId, setCategoryId] = React.useState<string>("")
  const [amount, setAmount] = React.useState<string>("")
  const [date, setDate] = React.useState<string>(toISODate(new Date()))
  const [note, setNote] = React.useState<string>("")
  const [dateOpen, setDateOpen] = React.useState(false)

  React.useEffect(() => {
    if (editing) {
      setViewId(editing.viewId)
      setCategoryId(editing.categoryId)
      setAmount(editing.amount.toString())
      setDate(editing.date.slice(0, 10))
      setNote(editing.note || "")
      setOpen(true)
    }
  }, [editing])

  React.useEffect(() => {
    if (views.length > 0 && (!viewId || !views.some((v) => v.id === viewId))) {
      // Prefer last-used view (only when not editing)
      if (!editing) {
        const lastView = typeof window !== "undefined" ? localStorage.getItem("et_last_view") : null
        const valid = lastView && views.some((v) => v.id === lastView)
        setViewId(valid ? lastView! : views[0].id)
      } else {
        setViewId(views[0].id)
      }
    }
  }, [views, viewId, editing])

  React.useEffect(() => {
    const cats = categories.filter((c) => c.viewId === viewId)
    if (cats.length > 0 && !cats.some((c) => c.id === categoryId)) {
      // Prefer last-used category for this view (only when not editing)
      if (!editing) {
        const lastCat = typeof window !== "undefined" ? localStorage.getItem("et_last_cat") : null
        const valid = lastCat && cats.some((c) => c.id === lastCat)
        setCategoryId(valid ? lastCat! : cats[0].id)
      } else {
        setCategoryId(cats[0].id)
      }
    }
  }, [viewId, categories, categoryId, editing])

  const reset = () => {
    const lastView = typeof window !== "undefined" ? localStorage.getItem("et_last_view") : null
    const targetViewId = (lastView && views.some((v) => v.id === lastView)) ? lastView : (views[0]?.id || "")
    setViewId(targetViewId)
    const cats = categories.filter((c) => c.viewId === targetViewId)
    const lastCat = typeof window !== "undefined" ? localStorage.getItem("et_last_cat") : null
    const validCat = lastCat && cats.some((c) => c.id === lastCat)
    setCategoryId(validCat ? lastCat! : (cats[0]?.id || ""))
    setAmount("")
    setDate(toISODate(new Date()))
    setNote("")
  }

  const handleAddNew = () => {
    setOpen(false)
    onDone?.()
    onNavigateToManage?.()
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = Number.parseFloat(amount)
    if (!viewId || !categoryId || !amount || isNaN(amt) || !date) return

    if (editing) {
      updateExpense(editing.id, {
        viewId,
        categoryId,
        amount: amt,
        date,
        note: note.trim() || undefined,
      })
    } else {
      addExpense({
        viewId,
        categoryId,
        amount: amt,
        date,
        note: note.trim() || undefined,
      })
      // Remember last-used view + category for next time
      if (typeof window !== "undefined") {
        localStorage.setItem("et_last_view", viewId)
        localStorage.setItem("et_last_cat", categoryId)
      }
    }

    setOpen(false)
    reset()
    onDone?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full px-6 py-3 text-lg flex items-center gap-2 shadow-lg bg-primary text-white hover:bg-primary/90"
        >
          <Plus className="w-5 h-5" /> Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label>View</Label>
            <ViewSelect
              value={viewId}
              onValueChange={setViewId}
              onAddNew={handleAddNew}
            />
          </div>

          <div className="grid gap-2">
            <Label>Subcategory</Label>
            <CategorySelect
              value={categoryId}
              onValueChange={setCategoryId}
              filterByViewId={viewId}
              onAddNew={handleAddNew}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label>Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="justify-start text-left font-normal bg-transparent"
                  onClick={() => setDateOpen(true)}
                >
                  <CalendarIcon className="mr-2 size-4" />
                  {date || "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Calendar
                  mode="single"
                  selected={date ? new Date(date) : undefined}
                  onSelect={(d) => {
                    if (d) {
                      setDate(toISODate(d))
                      setDateOpen(false)
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Textarea id="note" placeholder="Details" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>

          <DialogFooter>
            <Button type="submit">{editing ? "Save" : "Add"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

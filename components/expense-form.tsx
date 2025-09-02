"use client"

import * as React from "react"
import { useCategories, useViews, addExpense, updateExpense } from "@/lib/storage"
import type { Expense } from "@/lib/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { emojiFor } from "@/lib/emoji"
import { toISODate } from "@/lib/date"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus } from "lucide-react"

type Props = {
  editing?: Expense | null
  onDone?: () => void
}

export function ExpenseForm({ editing, onDone }: Props) {
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
    if (!viewId && views.length > 0) setViewId(views[0].id)
  }, [views, viewId])

  React.useEffect(() => {
    const cats = categories.filter((c) => c.viewId === viewId)
    if (cats.length > 0 && !cats.some((c) => c.id === categoryId)) {
      setCategoryId(cats[0].id)
    }
  }, [viewId, categories, categoryId])

  const reset = () => {
    setViewId(views[0]?.id || "")
    const firstCat = categories.find((c) => c.viewId === views[0]?.id)
    setCategoryId(firstCat?.id || "")
    setAmount("")
    setDate(toISODate(new Date()))
    setNote("")
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
            <Select value={viewId} onValueChange={setViewId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a view" />
              </SelectTrigger>
              <SelectContent>
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
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories
                  .filter((c) => c.viewId === viewId)
                  .map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {emojiFor(c.name)} {c.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
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
                  initialFocus
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

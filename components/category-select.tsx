"use client"

import { useCategories } from "@/lib/storage"
import { emojiFor } from "@/lib/emoji"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PlusCircle } from "lucide-react"

type Props = {
  value: string
  onValueChange: (value: string) => void
  /** When set, only shows categories belonging to this view */
  filterByViewId?: string
  /** Show an "All" option at the top (used in filters) */
  includeAll?: boolean
  /** Called when user clicks "+ Add new subcategory" */
  onAddNew?: () => void
  placeholder?: string
  disabled?: boolean
}

export function CategorySelect({
  value,
  onValueChange,
  filterByViewId,
  includeAll,
  onAddNew,
  placeholder = "Select subcategory",
  disabled,
}: Props) {
  const { data: categories = [] } = useCategories()

  const visible = filterByViewId
    ? categories.filter((c) => c.viewId === filterByViewId)
    : categories

  const handleChange = (v: string) => {
    if (v === "__add_new__") {
      onAddNew?.()
      return
    }
    onValueChange(v)
  }

  return (
    <Select value={value} onValueChange={handleChange} disabled={disabled}>
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {includeAll && <SelectItem value="all">All</SelectItem>}
        {visible.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {emojiFor(c.name)} {c.name}
          </SelectItem>
        ))}
        {onAddNew && (
          <>
            <SelectSeparator />
            <SelectItem value="__add_new__" className="text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" /> Add new subcategory
              </span>
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  )
}

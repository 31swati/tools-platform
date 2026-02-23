"use client"

import { useViews } from "@/lib/storage"
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
  /** Show an "All Views" option at the top (used in filters) */
  includeAll?: boolean
  /** Called when user clicks "+ Add new view" */
  onAddNew?: () => void
  placeholder?: string
  disabled?: boolean
}

export function ViewSelect({
  value,
  onValueChange,
  includeAll,
  onAddNew,
  placeholder = "Select a view",
  disabled,
}: Props) {
  const { data: views = [] } = useViews()

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
        {includeAll && <SelectItem value="all">All Views</SelectItem>}
        {views.map((v) => (
          <SelectItem key={v.id} value={v.id}>
            {v.name}
          </SelectItem>
        ))}
        {onAddNew && (
          <>
            <SelectSeparator />
            <SelectItem value="__add_new__" className="text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <PlusCircle className="w-3.5 h-3.5" /> Add new view
              </span>
            </SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  )
}

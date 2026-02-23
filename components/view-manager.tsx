"use client"

import * as React from "react"
import { useCategories, useViews, addView, addCategory, deleteCategory, deleteView } from "@/lib/storage"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { emojiFor } from "@/lib/emoji"
import { Trash2 } from "lucide-react"

export function ViewManager() {
  const { data: views = [] } = useViews()
  const { data: categories = [] } = useCategories()

  const [viewName, setViewName] = React.useState("")
  const [selectedViewId, setSelectedViewId] = React.useState<string>("")
  const [categoryName, setCategoryName] = React.useState("")

  React.useEffect(() => {
    if (views.length > 0 && (!selectedViewId || !views.some((v) => v.id === selectedViewId))) {
      setSelectedViewId(views[0].id)
    }
  }, [views, selectedViewId])

  const handleAddView = () => {
    if (!viewName.trim()) return
    addView(viewName.trim())
    setViewName("")
  }

  const handleAddCategory = () => {
    if (!categoryName.trim() || !selectedViewId) return
    addCategory(selectedViewId, categoryName.trim())
    setCategoryName("")
  }

  const handleDeleteCategory = (id: string, name: string) => {
    if (!window.confirm(`Delete subcategory "${name}"?\n\nAll expenses in this subcategory will also be permanently deleted.`)) return
    deleteCategory(id)
  }

  const handleDeleteView = (id: string, name: string) => {
    if (!window.confirm(`Delete view "${name}"?\n\nAll subcategories and expenses in this view will also be permanently deleted.`)) return
    deleteView(id)
    // If the deleted view was selected, clear selection
    if (selectedViewId === id) setSelectedViewId("")
  }

  const selectedCategories = categories.filter((c) => c.viewId === selectedViewId)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* ── Views ─────────────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Views</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {/* Add form */}
          <div className="flex gap-2">
            <Input
              placeholder="New view name…"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddView()}
            />
            <Button onClick={handleAddView} className="shrink-0">Add</Button>
          </div>

          {/* Existing views */}
          <ul className="grid gap-1">
            {views.length === 0 && (
              <li className="text-sm text-muted-foreground">No views yet</li>
            )}
            {views.map((v) => (
              <li key={v.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 group">
                <span className="text-sm">
                  {emojiFor(v.name)} {v.name}
                </span>
                <button
                  onClick={() => handleDeleteView(v.id, v.name)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  title={`Delete view "${v.name}"`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* ── Subcategories ─────────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Subcategories</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label>View</Label>
            <Select value={selectedViewId} onValueChange={setSelectedViewId}>
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

          {/* Add subcategory */}
          <div className="flex gap-2">
            <Input
              placeholder="New subcategory name…"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
            />
            <Button onClick={handleAddCategory} className="shrink-0">Add</Button>
          </div>

          {/* Existing subcategories */}
          <ul className="grid gap-1">
            {selectedCategories.length === 0 && (
              <li className="text-sm text-muted-foreground">No subcategories yet</li>
            )}
            {selectedCategories.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-2 rounded-md px-2 py-1.5 hover:bg-muted/50 group">
                <span className="text-sm">
                  {emojiFor(c.name)} {c.name}
                </span>
                <button
                  onClick={() => handleDeleteCategory(c.id, c.name)}
                  className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
                  title={`Delete subcategory "${c.name}"`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

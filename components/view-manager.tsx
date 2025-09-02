"use client"

import * as React from "react"
import { useCategories, useViews, addView, addCategory } from "@/lib/storage"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { emojiFor } from "@/lib/emoji"

export function ViewManager() {
  const { data: views = [] } = useViews()
  const { data: categories = [] } = useCategories()

  const [viewName, setViewName] = React.useState("")
  const [selectedViewId, setSelectedViewId] = React.useState<string>("")
  const [categoryName, setCategoryName] = React.useState("")

  React.useEffect(() => {
    if (!selectedViewId && views.length > 0) {
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

  const selectedCategories = categories.filter((c) => c.viewId === selectedViewId)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Add View (Profile)</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="grid gap-2">
            <Label htmlFor="view-name">View name</Label>
            <Input
              id="view-name"
              placeholder="e.g., Travel or Construction"
              value={viewName}
              onChange={(e) => setViewName(e.target.value)}
            />
          </div>
          <Button onClick={handleAddView} className="w-fit">
            Add View
          </Button>
          <p className="text-sm text-muted-foreground">
            Pre-seeded views: Home and Personal. You can add more anytime.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Add Subcategory</CardTitle>
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
          <div className="grid gap-2">
            <Label htmlFor="cat-name">Subcategory name</Label>
            <Input
              id="cat-name"
              placeholder="e.g., Milk, Grocery, Labor"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
            />
          </div>
          <Button onClick={handleAddCategory} className="w-fit">
            Add Subcategory
          </Button>

          <div className="pt-2">
            <Label className="text-sm">Existing subcategories</Label>
            <ul className="mt-2 grid gap-1 text-sm text-muted-foreground">
              {selectedCategories.length === 0 && <li>No subcategories yet</li>}
              {selectedCategories.map((c) => (
                <li key={c.id}>
                  {emojiFor(c.name)} {c.name}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

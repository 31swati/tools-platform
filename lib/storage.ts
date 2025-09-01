// LocalStorage-backed data layer with SWR helpers

import useSWR, { mutate } from "swr"
import { v4 as uuid } from "uuid"
import type { Expense, ViewProfile, Category, Settings } from "./types"

const KEYS = {
  expenses: "et_expenses",
  views: "et_views",
  categories: "et_categories",
  settings: "et_settings",
} as const

export const ensureSeedData = () => {
  if (typeof window === "undefined") return
  const existingViews = localStorage.getItem(KEYS.views)
  const existingCats = localStorage.getItem(KEYS.categories)
  const existingSettings = localStorage.getItem(KEYS.settings)
  if (!existingViews || !existingCats) {
    const homeId = uuid()
    const personalId = uuid()
    const views: ViewProfile[] = [
      { id: homeId, name: "Home" },
      { id: personalId, name: "Personal" },
    ]
    const categories: Category[] = [
      { id: uuid(), viewId: homeId, name: "Grocery" },
      { id: uuid(), viewId: homeId, name: "Milk" },
      { id: uuid(), viewId: personalId, name: "Eating Out" },
      { id: uuid(), viewId: personalId, name: "Petrol" },
    ]
    localStorage.setItem(KEYS.views, JSON.stringify(views))
    localStorage.setItem(KEYS.categories, JSON.stringify(categories))
  }

  if (!existingSettings) {
    const settings: Settings = { currency: "INR" }
    localStorage.setItem(KEYS.settings, JSON.stringify(settings))
  }

  if (!localStorage.getItem(KEYS.expenses)) {
    localStorage.setItem(KEYS.expenses, JSON.stringify([] as Expense[]))
  }
}

const read = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const write = (key: string, value: unknown) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

export const useSettings = () =>
  useSWR<Settings>(KEYS.settings, () => read<Settings>(KEYS.settings, { currency: "INR" }))

export const setSettings = (s: Partial<Settings>) => {
  const current = read<Settings>(KEYS.settings, { currency: "INR" })
  const next = { ...current, ...s }
  write(KEYS.settings, next)
  mutate(KEYS.settings, next, false)
}

export const useViews = () => useSWR<ViewProfile[]>(KEYS.views, () => read<ViewProfile[]>(KEYS.views, []))
export const addView = (name: string) => {
  const list = read<ViewProfile[]>(KEYS.views, [])
  const next = [...list, { id: uuid(), name }]
  write(KEYS.views, next)
  mutate(KEYS.views, next, false)
}

export const useCategories = () => useSWR<Category[]>(KEYS.categories, () => read<Category[]>(KEYS.categories, []))
export const addCategory = (viewId: string, name: string) => {
  const list = read<Category[]>(KEYS.categories, [])
  const next = [...list, { id: uuid(), viewId, name }]
  write(KEYS.categories, next)
  mutate(KEYS.categories, next, false)
}

export const useExpenses = () => useSWR<Expense[]>(KEYS.expenses, () => read<Expense[]>(KEYS.expenses, []))
export const addExpense = (e: Omit<Expense, "id">) => {
  const list = read<Expense[]>(KEYS.expenses, [])
  const next = [{ ...e, id: uuid() }, ...list]
  write(KEYS.expenses, next)
  mutate(KEYS.expenses, next, false)
}
export const updateExpense = (id: string, patch: Partial<Expense>) => {
  const list = read<Expense[]>(KEYS.expenses, [])
  const next = list.map((e) => (e.id === id ? { ...e, ...patch, id } : e))
  write(KEYS.expenses, next)
  mutate(KEYS.expenses, next, false)
}
export const deleteExpense = (id: string) => {
  const list = read<Expense[]>(KEYS.expenses, [])
  const next = list.filter((e) => e.id !== id)
  write(KEYS.expenses, next)
  mutate(KEYS.expenses, next, false)
}

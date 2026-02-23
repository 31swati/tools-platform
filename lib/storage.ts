"use client"

// Dual-mode storage layer: localStorage (guest) ↔ Supabase (authenticated)

import useSWR, { mutate } from "swr"
import { v4 as uuid } from "uuid"
import type { Expense, ViewProfile, Category, Settings } from "./types"
import { supabase } from "./supabaseClient"
import { useStorageCtx } from "./storage-context"

// ---------------------------------------------------------------------------
// Module-level context – updated by auth-context before any re-render.
// Write functions (addExpense, etc.) use these since they run in event handlers,
// not during React rendering, so they can't call hooks.
// ---------------------------------------------------------------------------
let _mode: "local" | "cloud" = "local"
let _userId: string | undefined = undefined

export const setStorageContext = (mode: "local" | "cloud", userId?: string) => {
  _mode = mode
  _userId = userId
}

/** Broadcast re-validation to every active SWR key. */
export const revalidateAll = () => {
  mutate(() => true, undefined, { revalidate: true })
}

// ---------------------------------------------------------------------------
// localStorage keys
// ---------------------------------------------------------------------------
const KEYS = {
  expenses: "et_expenses",
  views: "et_views",
  categories: "et_categories",
  settings: "et_settings",
} as const

// ---------------------------------------------------------------------------
// localStorage helpers
// ---------------------------------------------------------------------------
const lsRead = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const lsWrite = (key: string, value: unknown) => {
  if (typeof window === "undefined") return
  localStorage.setItem(key, JSON.stringify(value))
}

// ---------------------------------------------------------------------------
// Seed data helpers
// ---------------------------------------------------------------------------

/** Initialises localStorage with default views/categories/settings if empty. */
export const ensureSeedData = () => {
  if (typeof window === "undefined") return
  const existingViews = localStorage.getItem(KEYS.views)
  const existingCats = localStorage.getItem(KEYS.categories)

  if (!existingViews || !existingCats) {
    const homeId = uuid()
    const personalId = uuid()
    const views: ViewProfile[] = [
      { id: homeId, name: "Home" },
      { id: personalId, name: "Personal" },
    ]
    const categories: Category[] = [
      { id: uuid(), viewId: homeId, name: "Misc" },
      { id: uuid(), viewId: homeId, name: "Grocery" },
      { id: uuid(), viewId: homeId, name: "Milk" },
      { id: uuid(), viewId: personalId, name: "Misc" },
      { id: uuid(), viewId: personalId, name: "Eating Out" },
      { id: uuid(), viewId: personalId, name: "Petrol" },
    ]
    lsWrite(KEYS.views, views)
    lsWrite(KEYS.categories, categories)
  }

  if (!localStorage.getItem(KEYS.settings)) {
    lsWrite(KEYS.settings, { currency: "INR" } as Settings)
  }

  if (!localStorage.getItem(KEYS.expenses)) {
    lsWrite(KEYS.expenses, [] as Expense[])
  }
}

/** Creates default views/categories/settings in Supabase for brand-new users. */
export const ensureCloudSeedData = async (userId: string): Promise<boolean> => {
  const { data: existing } = await supabase
    .from("views")
    .select("id")
    .eq("user_id", userId)
    .limit(1)

  if (existing && existing.length > 0) return false // already set up

  const { data: views } = await supabase
    .from("views")
    .insert([
      { user_id: userId, name: "Home" },
      { user_id: userId, name: "Personal" },
    ])
    .select()

  if (views) {
    const home = views.find((v) => v.name === "Home")
    const personal = views.find((v) => v.name === "Personal")
    if (home && personal) {
      await supabase.from("categories").insert([
        { user_id: userId, view_id: home.id, name: "Misc" },
        { user_id: userId, view_id: home.id, name: "Grocery" },
        { user_id: userId, view_id: home.id, name: "Milk" },
        { user_id: userId, view_id: personal.id, name: "Misc" },
        { user_id: userId, view_id: personal.id, name: "Eating Out" },
        { user_id: userId, view_id: personal.id, name: "Petrol" },
      ])
    }
  }

  await supabase.from("settings").upsert({ user_id: userId, currency: "INR" })
  return true
}

// ---------------------------------------------------------------------------
// Settings
// ---------------------------------------------------------------------------

export const useSettings = () => {
  const { mode, userId } = useStorageCtx()
  return useSWR<Settings>(
    [KEYS.settings, mode, userId ?? "anon"],
    async ([key, m, uid]: [string, string, string]) => {
      if (m === "cloud" && uid !== "anon") {
        const { data } = await supabase
          .from("settings")
          .select("currency")
          .eq("user_id", uid)
          .single()
        return (data as Settings | null) ?? { currency: "INR" }
      }
      return lsRead<Settings>(key, { currency: "INR" })
    },
  )
}

export const setSettings = async (s: Partial<Settings>) => {
  if (_mode === "cloud" && _userId) {
    await supabase.from("settings").upsert({ user_id: _userId, ...s })
    mutate([KEYS.settings, "cloud", _userId])
  } else {
    const current = lsRead<Settings>(KEYS.settings, { currency: "INR" })
    const next = { ...current, ...s }
    lsWrite(KEYS.settings, next)
    mutate([KEYS.settings, "local", "anon"], next, false)
  }
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

export const useViews = () => {
  const { mode, userId } = useStorageCtx()
  return useSWR<ViewProfile[]>(
    [KEYS.views, mode, userId ?? "anon"],
    async ([key, m, uid]: [string, string, string]) => {
      if (m === "cloud" && uid !== "anon") {
        const { data } = await supabase
          .from("views")
          .select("id, name, is_default")
          .eq("user_id", uid)
        return (data ?? []).map((v) => ({
          id: v.id as string,
          name: v.name as string,
          isDefault: v.is_default as boolean | undefined,
        }))
      }
      return lsRead<ViewProfile[]>(key, [])
    },
  )
}

export const addView = async (name: string) => {
  if (_mode === "cloud" && _userId) {
    await supabase.from("views").insert({ user_id: _userId, name })
    mutate([KEYS.views, "cloud", _userId])
  } else {
    const list = lsRead<ViewProfile[]>(KEYS.views, [])
    const next = [...list, { id: uuid(), name }]
    lsWrite(KEYS.views, next)
    mutate([KEYS.views, "local", "anon"], next, false)
  }
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const useCategories = () => {
  const { mode, userId } = useStorageCtx()
  return useSWR<Category[]>(
    [KEYS.categories, mode, userId ?? "anon"],
    async ([key, m, uid]: [string, string, string]) => {
      if (m === "cloud" && uid !== "anon") {
        const { data } = await supabase
          .from("categories")
          .select("id, view_id, name")
          .eq("user_id", uid)
        return (data ?? []).map((c) => ({
          id: c.id as string,
          viewId: c.view_id as string,
          name: c.name as string,
        }))
      }
      return lsRead<Category[]>(key, [])
    },
  )
}

export const addCategory = async (viewId: string, name: string) => {
  if (_mode === "cloud" && _userId) {
    await supabase.from("categories").insert({ user_id: _userId, view_id: viewId, name })
    mutate([KEYS.categories, "cloud", _userId])
  } else {
    const list = lsRead<Category[]>(KEYS.categories, [])
    const next = [...list, { id: uuid(), viewId, name }]
    lsWrite(KEYS.categories, next)
    mutate([KEYS.categories, "local", "anon"], next, false)
  }
}

export const deleteCategory = async (id: string) => {
  if (_mode === "cloud" && _userId) {
    // Supabase cascade removes linked expenses automatically
    await supabase.from("categories").delete().eq("id", id).eq("user_id", _userId)
    mutate([KEYS.categories, "cloud", _userId])
    mutate([KEYS.expenses, "cloud", _userId])
  } else {
    const cats = lsRead<Category[]>(KEYS.categories, [])
    const expenses = lsRead<Expense[]>(KEYS.expenses, [])
    const nextCats = cats.filter((c) => c.id !== id)
    const nextExp = expenses.filter((e) => e.categoryId !== id)
    lsWrite(KEYS.categories, nextCats)
    lsWrite(KEYS.expenses, nextExp)
    mutate([KEYS.categories, "local", "anon"], nextCats, false)
    mutate([KEYS.expenses, "local", "anon"], nextExp, false)
  }
}

export const deleteView = async (id: string) => {
  if (_mode === "cloud" && _userId) {
    // Supabase cascade removes categories + their expenses automatically
    await supabase.from("views").delete().eq("id", id).eq("user_id", _userId)
    mutate([KEYS.views, "cloud", _userId])
    mutate([KEYS.categories, "cloud", _userId])
    mutate([KEYS.expenses, "cloud", _userId])
  } else {
    const views = lsRead<ViewProfile[]>(KEYS.views, [])
    const cats = lsRead<Category[]>(KEYS.categories, [])
    const expenses = lsRead<Expense[]>(KEYS.expenses, [])
    const catIds = cats.filter((c) => c.viewId === id).map((c) => c.id)
    const nextViews = views.filter((v) => v.id !== id)
    const nextCats = cats.filter((c) => c.viewId !== id)
    const nextExp = expenses.filter((e) => !catIds.includes(e.categoryId))
    lsWrite(KEYS.views, nextViews)
    lsWrite(KEYS.categories, nextCats)
    lsWrite(KEYS.expenses, nextExp)
    mutate([KEYS.views, "local", "anon"], nextViews, false)
    mutate([KEYS.categories, "local", "anon"], nextCats, false)
    mutate([KEYS.expenses, "local", "anon"], nextExp, false)
  }
}

// ---------------------------------------------------------------------------
// Expenses
// ---------------------------------------------------------------------------

export const useExpenses = () => {
  const { mode, userId } = useStorageCtx()
  return useSWR<Expense[]>(
    [KEYS.expenses, mode, userId ?? "anon"],
    async ([key, m, uid]: [string, string, string]) => {
      if (m === "cloud" && uid !== "anon") {
        const { data } = await supabase
          .from("expenses")
          .select("id, view_id, category_id, amount, date, note")
          .eq("user_id", uid)
          .order("date", { ascending: false })
        return (data ?? []).map((e) => ({
          id: e.id as string,
          viewId: e.view_id as string,
          categoryId: e.category_id as string,
          amount: Number(e.amount),
          date: e.date as string,
          note: (e.note ?? undefined) as string | undefined,
        }))
      }
      return lsRead<Expense[]>(key, [])
    },
  )
}

export const addExpense = async (e: Omit<Expense, "id">) => {
  if (_mode === "cloud" && _userId) {
    await supabase.from("expenses").insert({
      user_id: _userId,
      view_id: e.viewId,
      category_id: e.categoryId,
      amount: e.amount,
      date: e.date,
      note: e.note ?? null,
    })
    mutate([KEYS.expenses, "cloud", _userId])
  } else {
    const list = lsRead<Expense[]>(KEYS.expenses, [])
    const next = [{ ...e, id: uuid() }, ...list]
    lsWrite(KEYS.expenses, next)
    mutate([KEYS.expenses, "local", "anon"], next, false)
  }
}

export const updateExpense = async (id: string, patch: Partial<Expense>) => {
  if (_mode === "cloud" && _userId) {
    const dbPatch: Record<string, unknown> = {}
    if (patch.viewId !== undefined) dbPatch.view_id = patch.viewId
    if (patch.categoryId !== undefined) dbPatch.category_id = patch.categoryId
    if (patch.amount !== undefined) dbPatch.amount = patch.amount
    if (patch.date !== undefined) dbPatch.date = patch.date
    if (patch.note !== undefined) dbPatch.note = patch.note ?? null
    await supabase.from("expenses").update(dbPatch).eq("id", id).eq("user_id", _userId)
    mutate([KEYS.expenses, "cloud", _userId])
  } else {
    const list = lsRead<Expense[]>(KEYS.expenses, [])
    const next = list.map((e) => (e.id === id ? { ...e, ...patch, id } : e))
    lsWrite(KEYS.expenses, next)
    mutate([KEYS.expenses, "local", "anon"], next, false)
  }
}

export const deleteExpense = async (id: string) => {
  if (_mode === "cloud" && _userId) {
    await supabase.from("expenses").delete().eq("id", id).eq("user_id", _userId)
    mutate([KEYS.expenses, "cloud", _userId])
  } else {
    const list = lsRead<Expense[]>(KEYS.expenses, [])
    const next = list.filter((e) => e.id !== id)
    lsWrite(KEYS.expenses, next)
    mutate([KEYS.expenses, "local", "anon"], next, false)
  }
}

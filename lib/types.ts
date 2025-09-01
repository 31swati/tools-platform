// Types for the expense tracker

export type Currency = "USD" | "INR"

export type ViewProfile = {
  id: string
  name: string
}

export type Category = {
  id: string
  viewId: string
  name: string
}

export type Expense = {
  id: string
  viewId: string
  categoryId: string
  amount: number
  date: string // ISO date string YYYY-MM-DD
  note?: string
}

export type Settings = {
  currency: Currency
}

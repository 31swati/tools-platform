import type { Currency } from "./types"

export const currencySymbol = (c: Currency) => (c === "INR" ? "₹" : "$")

export const currencies: { label: string; value: Currency; symbol: string }[] = [
  { label: "USD ($)", value: "USD", symbol: "$" },
  { label: "INR (₹)", value: "INR", symbol: "₹" },
]

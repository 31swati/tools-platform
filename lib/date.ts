// Date helpers for period selection and filtering

export type Period = "week" | "month" | "custom"

export type DateRange = { from: string | null; to: string | null } // ISO strings (YYYY-MM-DD)

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`)

export const toISODate = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

export const startOfWeek = (d = new Date()) => {
  // Monday as start of week
  const date = new Date(d)
  const day = (date.getDay() + 6) % 7 // convert Sunday(0) to 6
  date.setDate(date.getDate() - day)
  date.setHours(0, 0, 0, 0)
  return date
}

export const endOfWeek = (d = new Date()) => {
  const s = startOfWeek(d)
  const e = new Date(s)
  e.setDate(s.getDate() + 6)
  e.setHours(23, 59, 59, 999)
  return e
}

export const startOfMonth = (d = new Date()) => {
  const s = new Date(d.getFullYear(), d.getMonth(), 1)
  s.setHours(0, 0, 0, 0)
  return s
}

export const endOfMonth = (d = new Date()) => {
  const e = new Date(d.getFullYear(), d.getMonth() + 1, 0)
  e.setHours(23, 59, 59, 999)
  return e
}

export const defaultRangeForPeriod = (period: Period): DateRange => {
  if (period === "week") {
    return { from: toISODate(startOfWeek()), to: toISODate(endOfWeek()) }
  }
  if (period === "month") {
    return { from: toISODate(startOfMonth()), to: toISODate(endOfMonth()) }
  }
  // custom starts empty
  return { from: null, to: null }
}

export const isWithinRange = (isoDate: string, range: DateRange) => {
  if (!range.from && !range.to) return true
  const t = new Date(isoDate).getTime()
  if (range.from && t < new Date(range.from).getTime()) return false
  if (range.to) {
    // include end day fully
    const end = new Date(range.to)
    end.setHours(23, 59, 59, 999)
    if (t > end.getTime()) return false
  }
  return true
}

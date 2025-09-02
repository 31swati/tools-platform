const rules: Array<{ match: RegExp; emoji: string }> = [
  { match: /\b(home|house|rent|mortgage)\b/i, emoji: "🏠" },
  { match: /\b(personal|me|self|misc)\b/i, emoji: "👤" },
  { match: /\b(construction|labor|cement|brick|builder|contractor)\b/i, emoji: "🏗️" },
  { match: /\b(travel|trip|flight|bus|train|taxi|hotel)\b/i, emoji: "🧳" },
  { match: /\b(grocery|vegetable|vegg?ies|supermarket|ration)\b/i, emoji: "🛒" },
  { match: /\b(milk|dairy)\b/i, emoji: "🥛" },
  { match: /\b(petrol|diesel|gas|fuel)\b/i, emoji: "⛽" },
  { match: /\b(eating out|restaurant|dining|food|snack|coffee)\b/i, emoji: "🍽️" },
  { match: /\b(health|medical|doctor|pharmacy|medicine)\b/i, emoji: "🏥" },
  { match: /\b(education|school|tuition|course)\b/i, emoji: "🎓" },
  { match: /\b(utilit(y|ies)|electric|water|internet|wifi|broadband)\b/i, emoji: "🔌" },
]

export function emojiFor(name: string | undefined | null): string {
  if (!name) return "🔹"
  for (const r of rules) {
    if (r.match.test(name)) return r.emoji
  }
  return "🔹"
}

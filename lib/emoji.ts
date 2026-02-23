const rules: Array<{ match: RegExp; emoji: string }> = [
  // Views / broad categories
  { match: /\b(home|house|rent|mortgage|flat|apartment)\b/i, emoji: "🏠" },
  { match: /\b(personal|me|self)\b/i, emoji: "👤" },
  { match: /\b(work|office|business|professional|corporate)\b/i, emoji: "💼" },
  { match: /\b(construction|labor|cement|brick|builder|contractor|renovation|repair)\b/i, emoji: "🏗️" },
  { match: /\b(investment|invest|stocks|shares|mutual.?fund|sip|portfolio|trading)\b/i, emoji: "📈" },
  { match: /\b(saving|savings|emergency.?fund|piggy)\b/i, emoji: "🏦" },
  { match: /\b(insurance|policy|premium|cover)\b/i, emoji: "🛡️" },
  { match: /\b(loan|emi|mortgage|debt|credit.?card|borrow)\b/i, emoji: "💳" },
  { match: /\b(tax|income.?tax|gst|tds|itr)\b/i, emoji: "📋" },

  // Food & Drink
  { match: /\b(grocery|groceries|vegetable|vegg?ies|supermarket|ration|sabzi)\b/i, emoji: "🛒" },
  { match: /\b(milk|dairy|curd|yogurt|paneer|butter|cheese)\b/i, emoji: "🥛" },
  { match: /\b(fruit|fruits|apple|banana|mango|orange)\b/i, emoji: "🍎" },
  { match: /\b(bakery|bread|cake|pastry|biscuit|cookie|dessert|sweet|mithai)\b/i, emoji: "🍰" },
  { match: /\b(coffee|cafe|latte|cappuccino|espresso|tea|chai)\b/i, emoji: "☕" },
  { match: /\b(eating.?out|restaurant|dining|dine|food|snack|lunch|dinner|breakfast|biryani|pizza|burger|zomato|swiggy)\b/i, emoji: "🍽️" },
  { match: /\b(alcohol|beer|wine|whisky|liquor|drinks|bar|pub)\b/i, emoji: "🍺" },
  { match: /\b(water|mineral.?water|packaged.?water)\b/i, emoji: "💧" },

  // Transport
  { match: /\b(petrol|diesel|fuel|gas.?station|filling)\b/i, emoji: "⛽" },
  { match: /\b(uber|ola|cab|taxi|auto|rickshaw|rapido)\b/i, emoji: "🚖" },
  { match: /\b(bus|metro|local.?train|public.?transport|commute|pass)\b/i, emoji: "🚌" },
  { match: /\b(flight|air.?ticket|airline|airport|fly|aviation)\b/i, emoji: "✈️" },
  { match: /\b(train|rail|irctc|railway)\b/i, emoji: "🚆" },
  { match: /\b(car|vehicle|bike|motorcycle|scooter|ev|electric.?vehicle)\b/i, emoji: "🚗" },
  { match: /\b(parking|toll)\b/i, emoji: "🅿️" },
  { match: /\b(travel|trip|tour|holiday|vacation|hotel|stay|airbnb|hostel)\b/i, emoji: "🧳" },

  // Health
  { match: /\b(pharmacy|medicine|medic(al|ine|s)|tablet|capsule|drug)\b/i, emoji: "💊" },
  { match: /\b(doctor|physician|consult(ation)?|clinic|opp?d|appointment)\b/i, emoji: "🩺" },
  { match: /\b(hospital|surgery|operation|admission|icu)\b/i, emoji: "🏥" },
  { match: /\b(gym|fitness|workout|exercise|yoga|zumba|crossfit)\b/i, emoji: "🏋️" },
  { match: /\b(health|wellness|nutrition|supplement|protein|vitamin)\b/i, emoji: "❤️" },
  { match: /\b(salon|haircut|spa|massage|beauty|parlour|grooming|waxing|facial)\b/i, emoji: "💇" },

  // Shopping & Lifestyle
  { match: /\b(clothes|clothing|cloth|shirt|trouser|jeans|dress|apparel|fashion|wear|saree|kurta)\b/i, emoji: "👗" },
  { match: /\b(shoes|footwear|sneakers|sandals|boots|slippers|heels|chappal)\b/i, emoji: "👟" },
  { match: /\b(accessories|watch|jewel|ring|necklace|bag|handbag|wallet|sunglasses)\b/i, emoji: "💍" },
  { match: /\b(shopping|mall|amazon|flipkart|myntra|meesho|online.?shopping|e-comm)\b/i, emoji: "🛍️" },
  { match: /\b(furniture|sofa|bed|chair|table|wardrobe|almirah|shelf|rack)\b/i, emoji: "🛋️" },
  { match: /\b(appliance|fridge|washing.?machine|microwave|oven|ac|air.?conditioner|tv|television)\b/i, emoji: "📺" },
  { match: /\b(gadget|phone|mobile|laptop|tablet|ipad|iphone|android|earphone|headphone|charger|cable)\b/i, emoji: "📱" },
  { match: /\b(cleaning|detergent|soap|shampoo|toiletries|toilet|household|broom|mop|floor)\b/i, emoji: "🧹" },

  // Home utilities
  { match: /\b(electric|electricity|power|bill|MSEB|BESCOM|TNEB)\b/i, emoji: "⚡" },
  { match: /\b(internet|wifi|broadband|data|recharge|DTH|cable)\b/i, emoji: "🌐" },
  { match: /\b(gas|LPG|cylinder|PNG|piped.?gas)\b/i, emoji: "🔥" },
  { match: /\b(utilit(y|ies)|phone.?bill|mobile.?bill|landline|postpaid|prepaid)\b/i, emoji: "🔌" },
  { match: /\b(maid|cook|servant|domestic|helper|nanny|baby.?sitter|driver)\b/i, emoji: "🧑‍🍳" },
  { match: /\b(garden|plant|flower|pot|nursery|soil|fertilizer)\b/i, emoji: "🌱" },

  // Education & Kids
  { match: /\b(school|college|university|tuition|coaching|course|class|fee|admission)\b/i, emoji: "🎓" },
  { match: /\b(book|books|stationery|notebook|pen|pencil|study|textbook)\b/i, emoji: "📚" },
  { match: /\b(kids|child|children|baby|toy|toys|diaper|formula)\b/i, emoji: "🧒" },

  // Entertainment & Subscriptions
  { match: /\b(netflix|prime|hotstar|jiocinema|disney|hulu|streaming|ott)\b/i, emoji: "🎬" },
  { match: /\b(spotify|music|concert|show|event|ticket)\b/i, emoji: "🎵" },
  { match: /\b(game|gaming|playstation|xbox|steam|esports)\b/i, emoji: "🎮" },
  { match: /\b(subscription|membership|annual|renew)\b/i, emoji: "🔄" },
  { match: /\b(cinema|movie|film|theatre|multiplex|imax)\b/i, emoji: "🍿" },
  { match: /\b(sport|cricket|football|badminton|tennis|swim(ming)?|cycling)\b/i, emoji: "🏃" },

  // Social & Gifts
  { match: /\b(gift|gifting|present|birthday|wedding|anniversary|occasion|celebrat)\b/i, emoji: "🎁" },
  { match: /\b(donat(e|ion)|charity|temple|church|mosque|religious|puja|pooja|offering)\b/i, emoji: "🙏" },
  { match: /\b(party|celebration|function|event|dinner.?party|host)\b/i, emoji: "🎉" },

  // Kitchen
  { match: /\b(kitchen|cookware|utensil|vessel|pressure.?cooker|pan|kadai|tawa)\b/i, emoji: "🍳" },

  // Misc / catch-all
  { match: /\b(misc|miscellaneous|other|general|sundry)\b/i, emoji: "🗂️" },
]

export function emojiFor(name: string | undefined | null): string {
  if (!name) return "💰"
  for (const r of rules) {
    if (r.match.test(name)) return r.emoji
  }
  return "💰"
}

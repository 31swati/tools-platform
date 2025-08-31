import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Calculator, Palette, Search, TrendingUp, Zap } from "lucide-react"
import type { Metadata } from "next";

const toolCategories = [
  {
    title: "Dev Tools",
    description: "Code editors, debuggers, and development utilities",
    icon: Code,
    href: "/dev-tools",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Finance Tools",
    description: "Investment calculators, budget trackers, and financial analysis",
    icon: TrendingUp,
    href: "/finance-tools",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Design Tools",
    description: "Color palettes, typography, and creative resources",
    icon: Palette,
    href: "/design-tools",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "SEO Tools",
    description: "Keyword research, analytics, and optimization tools",
    icon: Search,
    href: "/seo-tools",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Calculators",
    description: "Mathematical, scientific, and specialized calculators",
    icon: Calculator,
    href: "/calculators",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Productivity Tools",
    description: "Task management, time tracking, and workflow optimization",
    icon: Zap,
    href: "/productivity-tools",
    gradient: "from-yellow-500 to-orange-500",
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      {/* Fancy background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(8,145,178,0.05)_25%,rgba(8,145,178,0.05)_50%,transparent_50%,transparent_75%,rgba(8,145,178,0.05)_75%)] bg-[length:60px_60px] pointer-events-none" />

      <div className="relative z-10">
        {/* Header */}
        <header className="container mx-auto px-6 py-12 text-center">
          <h1 className="font-serif font-black text-5xl md:text-6xl lg:text-7xl mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Tools Platform
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your comprehensive digital toolkit for development, finance, design, and productivity
          </p>
        </header>

        {/* Tool Categories Grid */}
        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {toolCategories.map((category) => {
              const IconComponent = category.icon
              return (
                <Link key={category.title} href={category.href} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 border-2 hover:border-accent/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.gradient} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      >
                        <IconComponent className="w-full h-full text-white" />
                      </div>
                      <CardTitle className="font-serif font-black text-2xl group-hover:text-accent transition-colors duration-300">
                        {category.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-base leading-relaxed">{category.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </main>

        {/* Footer */}
        <footer className="container mx-auto px-6 py-8 text-center">
          <p className="text-muted-foreground">Built with modern web technologies for the best user experience</p>
        </footer>
      </div>
    </div>
  )
}

export const metadata: Metadata = {
  title: "ToggleTools – Smart Tools for Everyday Productivity",
  description: "ToggleTools helps you manage tasks, projects, and productivity with modern, easy-to-use online tools.",
  keywords: ["ToggleTools", "productivity tools", "task management", "online tools"],
  openGraph: {
    title: "ToggleTools – Smart Tools for Everyday Productivity",
    description: "Discover ToggleTools: a modern suite of tools for projects, tasks, and productivity.",
    url: "https://www.toggletools.com",
    siteName: "ToggleTools",
    images: [
      {
        url: "https://www.toggletools.com/og-image.png", // we can add this later
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ToggleTools – Smart Tools for Everyday Productivity",
    description: "Discover ToggleTools: a modern suite of tools for projects, tasks, and productivity.",
    images: ["https://www.toggletools.com/og-image.png"],
  },
};
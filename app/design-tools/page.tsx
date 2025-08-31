import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Palette, Droplet, Image as ImageIcon } from "lucide-react"

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design Tools – ToggleTools",
  description:
    "Free design tools by ToggleTools. Pick colors, generate palettes, resize images, and explore resources for designers.",
  keywords: [
    "design tools",
    "color picker",
    "color palettes",
    "image resizer",
    "UI tools",
    "ToggleTools"
  ],
  openGraph: {
    title: "Design Tools – ToggleTools",
    description:
      "Explore free online design tools: color picker, palette generator, image resizer, and more.",
    url: "https://www.toggletools.com/design-tools",
    siteName: "ToggleTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Design Tools – ToggleTools",
    description:
      "Free design tools including color picker, palette generator, and image resizer.",
  },
};

const designTools = [
  {
    title: "Color Picker",
    description: "Pick and copy colors in multiple formats",
    icon: Droplet,
    href: "/design-tools/color-picker",
    gradient: "from-pink-500 to-rose-500",
    active: true,
  },
  {
    title: "Color Palettes",
    description: "Generate and explore color palettes",
    icon: Palette,
    href: "/design-tools/color-palettes",
    gradient: "from-indigo-500 to-violet-500",
    active: true,
  },
  {
    title: "Image Resizer",
    description: "Resize images online quickly",
    icon: ImageIcon,
    href: "/design-tools/image-resizer",
    gradient: "from-teal-500 to-cyan-500",
    active: true,
  },
  {
    title: "Logo Maker",
    description: "Create simple logos online",
    icon: Palette,
    href: "/design-tools/logo-maker",
    gradient: "from-yellow-500 to-orange-500",
    active: false,
  },
]

const sortedTools = [...designTools].sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))

export default function DesignToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="relative z-10">
        <header className="container mx-auto px-6 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Tools
          </Link>
          <div className="text-center">
            <h1 className="font-serif font-black text-5xl md:text-6xl mb-6 bg-gradient-to-r from-pink-500 via-red-500 to-orange-500 bg-clip-text text-transparent">
              Design Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Free online tools for designers: color picker, palettes, and image resizer.
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {sortedTools.map((tool) => {
              const IconComponent = tool.icon
              const cardContent = (
                <Card
                  className={`relative h-full transition-all duration-300 ${
                    tool.active
                      ? "hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 border-2 hover:border-accent/50 cursor-pointer"
                      : "opacity-60 cursor-not-allowed"
                  } bg-card/80 backdrop-blur-sm`}
                >
                  <CardHeader className="text-center pb-4">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tool.gradient} p-4 ${
                        tool.active ? "group-hover:scale-110 transition-transform duration-300 shadow-lg" : ""
                      }`}
                    >
                      <IconComponent className="w-full h-full text-white" />
                    </div>
                    <CardTitle className="font-serif font-black text-2xl group-hover:text-accent transition-colors duration-300">
                      {tool.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-center">
                    <CardDescription className="text-base leading-relaxed">{tool.description}</CardDescription>
                  </CardContent>

                  {/* Coming soon overlay */}
                  {!tool.active && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-2xl text-white text-lg font-semibold opacity-0 hover:opacity-100 transition-opacity duration-300">
                      🚧 Coming Soon
                    </div>
                  )}
                </Card>
              )

              return tool.active ? (
                <Link key={tool.title} href={tool.href} className="group">
                  {cardContent}
                </Link>
              ) : (
                <div key={tool.title} className="group">
                  {cardContent}
                </div>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

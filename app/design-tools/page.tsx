import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Palette, Pipette, ImageIcon, Type, Layers, Zap, Paintbrush, Grid3X3 } from "lucide-react"

const designTools = [
  {
    title: "Color Palettes",
    description: "Generate beautiful color schemes and palettes",
    icon: Palette,
    href: "/design-tools/color-palettes",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Color Picker",
    description: "Pick colors from images and generate codes",
    icon: Pipette,
    href: "/design-tools/color-picker",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Image Resizer",
    description: "Resize images while maintaining quality",
    icon: ImageIcon,
    href: "/design-tools/image-resizer",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Format Converter",
    description: "Convert between PNG, JPG, WebP, and more",
    icon: ImageIcon,
    href: "/design-tools/format-converter",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Typography Tool",
    description: "Font pairing and typography generator",
    icon: Type,
    href: "/design-tools/typography-tool",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Gradient Generator",
    description: "Create beautiful CSS gradients",
    icon: Paintbrush,
    href: "/design-tools/gradient-generator",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "Icon Generator",
    description: "Create and customize SVG icons",
    icon: Zap,
    href: "/design-tools/icon-generator",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    title: "Layout Grid",
    description: "CSS Grid and Flexbox layout generator",
    icon: Grid3X3,
    href: "/design-tools/layout-grid",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    title: "Shadow Generator",
    description: "Create CSS box shadows and effects",
    icon: Layers,
    href: "/design-tools/shadow-generator",
    gradient: "from-violet-500 to-purple-500",
  },
]

export default function DesignToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(8,145,178,0.05)_25%,rgba(8,145,178,0.05)_50%,transparent_50%,transparent_75%,rgba(8,145,178,0.05)_75%)] bg-[length:60px_60px] pointer-events-none" />

      <div className="relative z-10">
        <header className="container mx-auto px-6 py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Tools
          </Link>
          <div className="text-center">
            <h1 className="font-serif font-black text-5xl md:text-6xl mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Design Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Color palettes, typography, and creative resources for designers
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {designTools.map((tool) => {
              const IconComponent = tool.icon
              return (
                <Link key={tool.title} href={tool.href} className="group">
                  <Card className="h-full transition-all duration-300 hover:shadow-2xl hover:shadow-accent/20 hover:-translate-y-2 border-2 hover:border-accent/50 bg-card/80 backdrop-blur-sm">
                    <CardHeader className="text-center pb-4">
                      <div
                        className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${tool.gradient} p-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
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
                  </Card>
                </Link>
              )
            })}
          </div>
        </main>
      </div>
    </div>
  )
}

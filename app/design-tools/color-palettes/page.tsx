"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Copy, CheckCircle, Palette, RefreshCw } from "lucide-react"

interface ColorPalette {
  name: string
  colors: string[]
  description: string
}

const predefinedPalettes: ColorPalette[] = [
  {
    name: "Ocean Breeze",
    colors: ["#0077BE", "#00A8CC", "#7DD3C0", "#FFEAA7", "#FD79A8"],
    description: "Cool and refreshing ocean-inspired colors",
  },
  {
    name: "Sunset Glow",
    colors: ["#FF6B6B", "#FF8E53", "#FF6B9D", "#C44569", "#F8B500"],
    description: "Warm sunset colors with vibrant energy",
  },
  {
    name: "Forest Green",
    colors: ["#2D5016", "#3E6B1F", "#4F7942", "#7FB069", "#D6EFC7"],
    description: "Natural green tones inspired by forests",
  },
  {
    name: "Purple Dreams",
    colors: ["#6C5CE7", "#A29BFE", "#FD79A8", "#FDCB6E", "#E17055"],
    description: "Dreamy purple and pink combinations",
  },
]

export default function ColorPalettesPage() {
  const [selectedPalette, setSelectedPalette] = useState<ColorPalette | null>(null)
  const [copiedColor, setCopiedColor] = useState("")

  const generateRandomPalette = (): ColorPalette => {
    const colors = []
    for (let i = 0; i < 5; i++) {
      const hue = Math.floor(Math.random() * 360)
      const saturation = Math.floor(Math.random() * 50) + 50
      const lightness = Math.floor(Math.random() * 40) + 30
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`)
    }
    return {
      name: "Random Palette",
      colors,
      description: "Randomly generated color palette",
    }
  }

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color)
    setCopiedColor(color)
    setTimeout(() => setCopiedColor(""), 2000)
  }

  const hslToHex = (hsl: string): string => {
    if (hsl.startsWith("#")) return hsl

    const match = hsl.match(/hsl$$(\d+),\s*(\d+)%,\s*(\d+)%$$/)
    if (!match) return hsl

    const h = Number.parseInt(match[1]) / 360
    const s = Number.parseInt(match[2]) / 100
    const l = Number.parseInt(match[3]) / 100

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1 / 6) return p + (q - p) * 6 * t
      if (t < 1 / 2) return q
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6
      return p
    }

    let r, g, b
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1 / 3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1 / 3)
    }

    const toHex = (c: number) => {
      const hex = Math.round(c * 255).toString(16)
      return hex.length === 1 ? "0" + hex : hex
    }

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10">
        <header className="container mx-auto px-6 py-12">
          <Link
            href="/design-tools"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Design Tools
          </Link>
          <div className="text-center">
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Color Palettes
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover beautiful color combinations for your design projects
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex justify-center">
              <Button
                onClick={() => setSelectedPalette(generateRandomPalette())}
                className="flex items-center gap-2"
                size="lg"
              >
                <RefreshCw className="w-5 h-5" />
                Generate Random Palette
              </Button>
            </div>

            {selectedPalette && (
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5" />
                    {selectedPalette.name}
                  </CardTitle>
                  <CardDescription>{selectedPalette.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-5 gap-4 mb-6">
                    {selectedPalette.colors.map((color, index) => (
                      <div key={index} className="space-y-2">
                        <div
                          className="w-full h-24 rounded-lg cursor-pointer transition-transform hover:scale-105 shadow-lg"
                          style={{ backgroundColor: color }}
                          onClick={() => copyColor(hslToHex(color))}
                        />
                        <div className="text-center space-y-1">
                          <p className="text-xs font-mono">{hslToHex(color)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyColor(hslToHex(color))}
                            className="h-6 text-xs"
                          >
                            {copiedColor === hslToHex(color) ? (
                              <CheckCircle className="w-3 h-3" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {predefinedPalettes.map((palette, index) => (
                <Card
                  key={index}
                  className="bg-card/80 backdrop-blur-sm cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                  onClick={() => setSelectedPalette(palette)}
                >
                  <CardHeader>
                    <CardTitle className="text-lg">{palette.name}</CardTitle>
                    <CardDescription>{palette.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {palette.colors.map((color, colorIndex) => (
                        <div key={colorIndex} className="flex-1 h-12 rounded" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

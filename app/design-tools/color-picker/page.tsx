"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Copy, CheckCircle, Pipette, Upload } from "lucide-react"

export default function ColorPickerPage() {
  const [selectedColor, setSelectedColor] = useState("#3B82F6")
  const [copiedValue, setCopiedValue] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result
      ? {
          r: Number.parseInt(result[1], 16),
          g: Number.parseInt(result[2], 16),
          b: Number.parseInt(result[3], 16),
        }
      : null
  }

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex)
    if (!rgb) return null

    const r = rgb.r / 255
    const g = rgb.g / 255
    const b = rgb.b / 255

    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    let h = 0
    let s = 0
    const l = (max + min) / 2

    if (max !== min) {
      const d = max - min
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    }
  }

  const copyValue = (value: string, type: string) => {
    navigator.clipboard.writeText(value)
    setCopiedValue(`${type}: ${value}`)
    setTimeout(() => setCopiedValue(""), 2000)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const url = e.target?.result as string
        setImageUrl(url)
        loadImageToCanvas(url)
      }
      reader.readAsDataURL(file)
    }
  }

  const loadImageToCanvas = (url: string) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      canvas.width = Math.min(img.width, 400)
      canvas.height = Math.min(img.height, 300)
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
    }
    img.src = url
  }

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const imageData = ctx.getImageData(x, y, 1, 1)
    const [r, g, b] = imageData.data

    const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b
      .toString(16)
      .padStart(2, "0")}`
    setSelectedColor(hex)
  }

  const rgb = hexToRgb(selectedColor)
  const hsl = hexToHsl(selectedColor)

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
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Color Picker
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pick colors from images and generate color codes
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Pipette className="w-5 h-5" />
                    Color Picker
                  </CardTitle>
                  <CardDescription>Select a color or upload an image to pick colors from</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="colorInput">Choose Color</Label>
                    <div className="flex gap-4 items-center">
                      <input
                        id="colorInput"
                        type="color"
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="w-16 h-16 rounded-lg border-2 border-border cursor-pointer"
                      />
                      <Input
                        value={selectedColor}
                        onChange={(e) => setSelectedColor(e.target.value)}
                        className="font-mono"
                        placeholder="#000000"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Upload Image</Label>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        className="flex items-center gap-2"
                      >
                        <Upload className="w-4 h-4" />
                        Choose Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>

                  {imageUrl && (
                    <div className="space-y-2">
                      <Label>Click on the image to pick a color</Label>
                      <canvas
                        ref={canvasRef}
                        onClick={handleCanvasClick}
                        className="border rounded-lg cursor-crosshair max-w-full"
                        style={{ maxHeight: "300px" }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Color Preview</CardTitle>
                  <CardDescription>Preview and copy color values</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div
                    className="w-full h-32 rounded-lg border-2 border-border"
                    style={{ backgroundColor: selectedColor }}
                  />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium">HEX</p>
                        <p className="font-mono text-sm text-muted-foreground">{selectedColor}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyValue(selectedColor, "HEX")}
                        className="flex items-center gap-2"
                      >
                        {copiedValue.includes(selectedColor) ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    {rgb && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">RGB</p>
                          <p className="font-mono text-sm text-muted-foreground">{`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyValue(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`, "RGB")}
                          className="flex items-center gap-2"
                        >
                          {copiedValue.includes(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}

                    {hsl && (
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">HSL</p>
                          <p className="font-mono text-sm text-muted-foreground">{`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyValue(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`, "HSL")}
                          className="flex items-center gap-2"
                        >
                          {copiedValue.includes(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`) ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {copiedValue && <p className="text-sm text-green-600 text-center">{copiedValue} copied!</p>}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

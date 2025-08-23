"use client"

import type React from "react"

import { useState, useRef } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Upload, Download, ImageIcon } from "lucide-react"

export default function ImageResizerPage() {
  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [resizedImage, setResizedImage] = useState<string | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true)
  const [quality, setQuality] = useState(0.9)
  const [format, setFormat] = useState("image/jpeg")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const img = new Image()
      img.onload = () => {
        setOriginalImage(img)
        setWidth(img.width)
        setHeight(img.height)
      }
      img.src = URL.createObjectURL(file)
    }
  }

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth)
    if (maintainAspectRatio && originalImage) {
      const aspectRatio = originalImage.height / originalImage.width
      setHeight(Math.round(newWidth * aspectRatio))
    }
  }

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight)
    if (maintainAspectRatio && originalImage) {
      const aspectRatio = originalImage.width / originalImage.height
      setWidth(Math.round(newHeight * aspectRatio))
    }
  }

  const resizeImage = () => {
    if (!originalImage || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = width
    canvas.height = height

    ctx.drawImage(originalImage, 0, 0, width, height)

    const resizedDataUrl = canvas.toDataURL(format, quality)
    setResizedImage(resizedDataUrl)
  }

  const downloadImage = () => {
    if (!resizedImage) return

    const link = document.createElement("a")
    link.download = `resized-image.${format.split("/")[1]}`
    link.href = resizedImage
    link.click()
  }

  const presetSizes = [
    { name: "Instagram Square", width: 1080, height: 1080 },
    { name: "Instagram Story", width: 1080, height: 1920 },
    { name: "Facebook Cover", width: 1200, height: 630 },
    { name: "Twitter Header", width: 1500, height: 500 },
    { name: "YouTube Thumbnail", width: 1280, height: 720 },
    { name: "LinkedIn Banner", width: 1584, height: 396 },
  ]

  const applyPreset = (presetWidth: number, presetHeight: number) => {
    setWidth(presetWidth)
    setHeight(presetHeight)
    setMaintainAspectRatio(false)
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
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Image Resizer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Resize images while maintaining quality for any platform
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <div className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Image
                  </CardTitle>
                  <CardDescription>Select an image to resize</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    className="w-full flex items-center gap-2"
                  >
                    <ImageIcon className="w-4 h-4" />
                    Choose Image
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />

                  {originalImage && (
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">
                        Original: {originalImage.width} × {originalImage.height}px
                      </p>
                      <img
                        src={originalImage.src || "/placeholder.svg"}
                        alt="Original"
                        className="max-w-full h-auto rounded-lg border"
                        style={{ maxHeight: "200px" }}
                      />
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resize Settings</CardTitle>
                  <CardDescription>Configure your image dimensions and quality</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="width">Width (px)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={width}
                        onChange={(e) => handleWidthChange(Number(e.target.value))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="height">Height (px)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={height}
                        onChange={(e) => handleHeightChange(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="aspectRatio"
                      checked={maintainAspectRatio}
                      onChange={(e) => setMaintainAspectRatio(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="aspectRatio">Maintain aspect ratio</Label>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="format">Output Format</Label>
                    <Select value={format} onValueChange={setFormat}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="image/jpeg">JPEG</SelectItem>
                        <SelectItem value="image/png">PNG</SelectItem>
                        <SelectItem value="image/webp">WebP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="quality">Quality: {Math.round(quality * 100)}%</Label>
                    <input
                      id="quality"
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={quality}
                      onChange={(e) => setQuality(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>

                  <Button onClick={resizeImage} disabled={!originalImage} className="w-full">
                    Resize Image
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Quick Presets</CardTitle>
                  <CardDescription>Common social media sizes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 gap-2">
                    {presetSizes.map((preset, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        onClick={() => applyPreset(preset.width, preset.height)}
                        className="justify-start"
                      >
                        <span className="font-medium">{preset.name}</span>
                        <span className="ml-auto text-muted-foreground text-sm">
                          {preset.width} × {preset.height}
                        </span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Resized Image</CardTitle>
                  <CardDescription>Preview and download your resized image</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {resizedImage ? (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                          Resized: {width} × {height}px
                        </p>
                        <img
                          src={resizedImage || "/placeholder.svg"}
                          alt="Resized"
                          className="max-w-full h-auto rounded-lg border"
                          style={{ maxHeight: "400px" }}
                        />
                      </div>
                      <Button onClick={downloadImage} className="w-full flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Resized Image
                      </Button>
                    </>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Resized image will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </main>
      </div>
    </div>
  )
}

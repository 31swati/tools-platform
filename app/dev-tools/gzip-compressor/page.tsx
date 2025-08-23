"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Copy, CheckCircle, Archive } from "lucide-react"

export default function GzipCompressorPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [compressionRatio, setCompressionRatio] = useState("")
  const [copied, setCopied] = useState(false)

  const compressText = async () => {
    try {
      const encoder = new TextEncoder()
      const data = encoder.encode(input)

      const stream = new CompressionStream("gzip")
      const writer = stream.writable.getWriter()
      const reader = stream.readable.getReader()

      writer.write(data)
      writer.close()

      const chunks = []
      let done = false

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) chunks.push(value)
      }

      const compressed = new Uint8Array(chunks.reduce((acc, chunk) => acc + chunk.length, 0))
      let offset = 0
      for (const chunk of chunks) {
        compressed.set(chunk, offset)
        offset += chunk.length
      }

      const base64 = btoa(String.fromCharCode(...compressed))
      setOutput(base64)

      const ratio = ((1 - compressed.length / data.length) * 100).toFixed(1)
      setCompressionRatio(`${ratio}% compression (${data.length} → ${compressed.length} bytes)`)
    } catch (err) {
      setOutput("Error compressing data")
      setCompressionRatio("")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.1),transparent_50%)] pointer-events-none" />

      <div className="relative z-10">
        <header className="container mx-auto px-6 py-12">
          <Link
            href="/dev-tools"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Dev Tools
          </Link>
          <div className="text-center">
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 bg-clip-text text-transparent">
              Gzip Compressor
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Compress text data using gzip compression</p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Archive className="w-5 h-5" />
                  Input Text
                </CardTitle>
                <CardDescription>Enter text to compress</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here to compress..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono"
                />
                <Button onClick={compressText} className="w-full" disabled={!input}>
                  Compress with Gzip
                </Button>
                {compressionRatio && <p className="text-sm text-green-600 font-medium">{compressionRatio}</p>}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Compressed Output (Base64)</CardTitle>
                <CardDescription>Gzip compressed data encoded as Base64</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[300px] font-mono text-xs"
                  placeholder="Compressed data will appear here..."
                />
                <Button onClick={copyToClipboard} disabled={!output} className="flex items-center gap-2">
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Compressed Data"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

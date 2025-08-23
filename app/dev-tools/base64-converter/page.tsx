"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Copy, CheckCircle } from "lucide-react"

export default function Base64ConverterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)

  const encodeBase64 = () => {
    try {
      const encoded = btoa(input)
      setOutput(encoded)
    } catch (err) {
      setOutput("Error encoding to Base64")
    }
  }

  const decodeBase64 = () => {
    try {
      const decoded = atob(input)
      setOutput(decoded)
    } catch (err) {
      setOutput("Error decoding from Base64")
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
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Base64 Converter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Encode and decode Base64 strings easily</p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Input Text</CardTitle>
                <CardDescription>Enter text to encode/decode</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Enter your text here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono"
                />
                <div className="flex gap-2">
                  <Button onClick={encodeBase64} className="flex-1">
                    Encode to Base64
                  </Button>
                  <Button onClick={decodeBase64} variant="outline" className="flex-1 bg-transparent">
                    Decode from Base64
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Output</CardTitle>
                <CardDescription>Converted result will appear here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[300px] font-mono"
                  placeholder="Converted text will appear here..."
                />
                <Button onClick={copyToClipboard} disabled={!output} className="flex items-center gap-2">
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? "Copied!" : "Copy Result"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

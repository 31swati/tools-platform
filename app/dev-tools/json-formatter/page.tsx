"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Copy, CheckCircle } from "lucide-react"

export default function JsonFormatterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError("")
    } catch (err) {
      setError("Invalid JSON format")
      setOutput("")
    }
  }

  const minifyJson = () => {
    try {
      const parsed = JSON.parse(input)
      const minified = JSON.stringify(parsed)
      setOutput(minified)
      setError("")
    } catch (err) {
      setError("Invalid JSON format")
      setOutput("")
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
            <h1 className="font-serif font-black text-4xl md:text-5xl mb-4 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              JSON Formatter
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Format, validate, and beautify your JSON data
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Input JSON</CardTitle>
                <CardDescription>Paste your JSON data here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder='{"name": "John", "age": 30}'
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="min-h-[300px] font-mono"
                />
                <div className="flex gap-2">
                  <Button onClick={formatJson} className="flex-1">
                    Format JSON
                  </Button>
                  <Button onClick={minifyJson} variant="outline" className="flex-1 bg-transparent">
                    Minify JSON
                  </Button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Formatted Output</CardTitle>
                <CardDescription>Your formatted JSON will appear here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  value={output}
                  readOnly
                  className="min-h-[300px] font-mono"
                  placeholder="Formatted JSON will appear here..."
                />
                <div className="flex gap-2">
                  <Button onClick={copyToClipboard} disabled={!output} className="flex items-center gap-2">
                    {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}

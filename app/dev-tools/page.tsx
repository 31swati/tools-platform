import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, FileArchive, FileJson, Type } from "lucide-react"

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Developer Tools – ToggleTools",
  description:
    "Free developer tools by ToggleTools. Format JSON, compress files, encode/decode Base64, and more to boost your productivity.",
  keywords: [
    "developer tools",
    "JSON formatter",
    "gzip compressor",
    "base64 converter",
    "coding tools",
    "ToggleTools"
  ],
  openGraph: {
    title: "Developer Tools – ToggleTools",
    description:
      "Discover developer tools like JSON formatter, gzip compressor, and base64 converter – free and easy to use.",
    url: "https://www.toggletools.com/dev-tools",
    siteName: "ToggleTools",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Developer Tools – ToggleTools",
    description:
      "Free online tools for developers: JSON formatter, gzip compressor, base64 converter, and more.",
  },
};

const devTools = [
  {
    title: "JSON Formatter",
    description: "Format and beautify JSON instantly",
    icon: FileJson,
    href: "/dev-tools/json-formatter",
    gradient: "from-blue-500 to-cyan-500",
    active: true,
  },
  {
    title: "Gzip Compressor",
    description: "Compress and decompress files online",
    icon: FileArchive,
    href: "/dev-tools/gzip-compressor",
    gradient: "from-purple-500 to-pink-500",
    active: true,
  },
  {
    title: "Base64 Converter",
    description: "Encode and decode Base64 text",
    icon: Type,
    href: "/dev-tools/base64-converter",
    gradient: "from-green-500 to-emerald-500",
    active: true,
  },
  {
    title: "Regex Tester",
    description: "Test and debug regex patterns",
    icon: Code,
    href: "/dev-tools/regex-tester",
    gradient: "from-orange-500 to-red-500",
    active: false,
  },
]

const sortedTools = [...devTools].sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1))

export default function DevToolsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-accent/10">
      <div className="relative z-10">
        <header className="container mx-auto px-6 py-12">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-accent transition-colors duration-300 mb-8 group">
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" />
            Back to Tools
          </Link>
          <div className="text-center">
            <h1 className="font-serif font-black text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">
              Developer Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Handy utilities for developers: format JSON, compress files, convert Base64, and more.
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

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Code, FileText, Archive, Key, Hash, Braces, Terminal, GitBranch, Database } from "lucide-react"

const devTools = [
  {
    title: "JSON Formatter",
    description: "Format, validate, and beautify JSON data",
    icon: Braces,
    href: "/dev-tools/json-formatter",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Base64 Converter",
    description: "Encode and decode Base64 strings",
    icon: Hash,
    href: "/dev-tools/base64-converter",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    title: "Gzip Compressor",
    description: "Compress and decompress gzip files",
    icon: Archive,
    href: "/dev-tools/gzip-compressor",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Encryption Tools",
    description: "Encrypt and decrypt text with various algorithms",
    icon: Key,
    href: "/dev-tools/encryption-tools",
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Code Formatter",
    description: "Format HTML, CSS, JavaScript, and more",
    icon: Code,
    href: "/dev-tools/code-formatter",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Text Utilities",
    description: "Case conversion, word count, and text manipulation",
    icon: FileText,
    href: "/dev-tools/text-utilities",
    gradient: "from-yellow-500 to-orange-500",
  },
  {
    title: "URL Encoder",
    description: "Encode and decode URLs and query parameters",
    icon: Terminal,
    href: "/dev-tools/url-encoder",
    gradient: "from-teal-500 to-cyan-500",
  },
  {
    title: "Git Utils",
    description: "Git command generator and branch utilities",
    icon: GitBranch,
    href: "/dev-tools/git-utils",
    gradient: "from-rose-500 to-pink-500",
  },
  {
    title: "SQL Formatter",
    description: "Format and beautify SQL queries",
    icon: Database,
    href: "/dev-tools/sql-formatter",
    gradient: "from-violet-500 to-purple-500",
  },
]

export default function DevToolsPage() {
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
            <h1 className="font-serif font-black text-5xl md:text-6xl mb-6 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 bg-clip-text text-transparent">
              Dev Tools
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Essential development utilities for coding, debugging, and productivity
            </p>
          </div>
        </header>

        <main className="container mx-auto px-6 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {devTools.map((tool) => {
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

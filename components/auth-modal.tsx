"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Shuffle, MailCheck } from "lucide-react"

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function makeStrongPassword(): string {
  const lower = "abcdefghijkmnpqrstuvwxyz"
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ"
  const digits = "23456789"
  const symbols = "!@#$%&*"
  const all = lower + upper + digits + symbols
  const buf = new Uint8Array(16)
  window.crypto.getRandomValues(buf)
  // Guarantee at least one of each class
  const pick = (src: string, idx: number) => src[buf[idx] % src.length]
  let pwd = pick(lower, 0) + pick(upper, 1) + pick(digits, 2) + pick(symbols, 3)
  for (let i = 4; i < 16; i++) pwd += pick(all, i)
  // Shuffle
  return pwd.split("").sort(() => (buf[0] % 2 ? 1 : -1)).join("")
}

export function AuthModal({ open, onOpenChange }: Props) {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  const reset = () => {
    setEmail("")
    setPassword("")
    setShowPassword(false)
    setError(null)
    setLoading(false)
    setConfirmationSent(false)
  }

  const handleClose = (open: boolean) => {
    if (!open) reset()
    onOpenChange(open)
  }

  const handleGeneratePassword = () => {
    setPassword(makeStrongPassword())
    setShowPassword(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === "signin") {
        const result = await signIn(email, password)
        if (result.error) setError(result.error.message)
        else handleClose(false)
      } else {
        const result = await signUp(email, password)
        if (result.error) {
          setError(result.error.message)
        } else if (result.needsConfirmation) {
          setConfirmationSent(true)
        } else {
          handleClose(false)
        }
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Email confirmation pending state ──────────────────────────────────────
  if (confirmationSent) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-sm text-center">
          <MailCheck className="mx-auto w-12 h-12 text-primary mt-2" />
          <DialogHeader>
            <DialogTitle className="text-center">Check your inbox</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            We sent a confirmation link to <strong>{email}</strong>. Click it to activate your
            account and you&apos;ll be signed in automatically.
          </p>
          <p className="text-xs text-muted-foreground">
            Tip: ask your admin to disable email confirmation in Supabase to skip this step.
          </p>
          <Button variant="outline" onClick={() => handleClose(false)} className="mt-2">
            Close
          </Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>
            {mode === "signin" ? "Sign in to your account" : "Create a free account"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="auth-email">Email</Label>
            <Input
              id="auth-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="auth-password">Password</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Input
                  id="auth-password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className="pr-10"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {mode === "signup" && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  title="Generate strong password"
                  onClick={handleGeneratePassword}
                >
                  <Shuffle className="w-4 h-4" />
                </Button>
              )}
            </div>
            {mode === "signup" && (
              <p className="text-xs text-muted-foreground">
                Min 6 characters — use the <Shuffle className="inline w-3 h-3" /> button to
                generate a strong one.
              </p>
            )}
          </div>

          {error && (
            <p className="text-sm text-destructive rounded-md bg-destructive/10 px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" disabled={loading} className="w-full">
            {loading
              ? "Please wait…"
              : mode === "signin"
                ? "Sign in"
                : "Create account"}
          </Button>

          <p className="text-sm text-center text-muted-foreground">
            {mode === "signin" ? (
              <>
                No account?{" "}
                <button
                  type="button"
                  className="underline font-medium"
                  onClick={() => { setMode("signup"); setError(null) }}
                >
                  Sign up free
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  className="underline font-medium"
                  onClick={() => { setMode("signin"); setError(null) }}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

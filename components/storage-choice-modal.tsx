"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AlertTriangle, CloudUpload, HardDrive } from "lucide-react"
import { AuthModal } from "./auth-modal"

type Props = {
  open: boolean
}

export function StorageChoiceModal({ open }: Props) {
  const { setStorageMode } = useAuth()
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      {/* Storage choice – hidden while auth modal is open */}
      <Dialog open={open && !showAuth} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md"
          onInteractOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader>
            <DialogTitle className="text-xl">Where should we save your data?</DialogTitle>
          </DialogHeader>

          <div className="grid gap-3 pt-1">
            {/* Cloud option – primary */}
            <button
              onClick={() => setShowAuth(true)}
              className="flex gap-4 items-start p-4 rounded-xl border-2 border-primary bg-primary/5 text-left hover:bg-primary/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              <CloudUpload className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-primary">Create a free account</p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Your data syncs across all your devices and is never lost — even if you clear
                  your browser.
                </p>
              </div>
            </button>

            {/* Local option – secondary with strong warning */}
            <button
              onClick={() => setStorageMode("local")}
              className="flex flex-col gap-3 p-4 rounded-xl border text-left hover:bg-muted/50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <div className="flex gap-4 items-center">
                <HardDrive className="w-6 h-6 text-muted-foreground shrink-0" />
                <p className="font-semibold">Continue without an account</p>
              </div>
              <div className="flex gap-2 items-start rounded-lg bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 px-3 py-2 w-full">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  <span className="font-semibold">Your data will only exist in this browser.</span>{" "}
                  Clearing browser data, switching to a different browser, or using another device
                  will permanently erase everything — with no way to recover it.
                </p>
              </div>
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Auth modal – slides in when user picks the cloud option */}
      <AuthModal
        open={showAuth}
        onOpenChange={(open) => {
          // If user closes auth without signing in, return to storage choice
          setShowAuth(open)
        }}
      />
    </>
  )
}

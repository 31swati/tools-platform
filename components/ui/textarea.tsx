import * as React from "react"
import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex w-full min-h-16 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm " +
          "placeholder:text-muted-foreground " +
          "hover:border-gray-400 hover:bg-gray-100 " +
          "focus:border-primary focus:ring-2 focus:ring-primary/60 " +
          "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }

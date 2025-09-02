import * as React from "react"
import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm shadow-sm " +
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

export { Input }

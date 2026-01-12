import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-sm border-2 px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-navy-500 bg-navy-500 text-white hover:bg-navy-600",
        secondary:
          "border-charcoal-500 bg-charcoal-500 text-white hover:bg-charcoal-600",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "border-navy-500 text-navy-500 bg-transparent",
        accent: "border-safety-500 bg-safety-500 text-white hover:bg-safety-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }

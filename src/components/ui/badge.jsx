import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border-2 px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-navy-400 bg-gradient-to-r from-navy-500 to-navy-600 text-white hover:from-navy-600 hover:to-navy-700 hover:scale-105 hover:shadow-lg",
        secondary:
          "border-charcoal-400 bg-gradient-to-r from-charcoal-500 to-charcoal-600 text-white hover:from-charcoal-600 hover:to-charcoal-700 hover:scale-105",
        destructive:
          "border-destructive bg-destructive text-destructive-foreground hover:bg-destructive/80 hover:scale-105",
        outline: "border-navy-500 text-navy-600 bg-white hover:bg-navy-50 hover:scale-105",
        accent: "border-orange-400 bg-gradient-to-r from-safety-500 to-orange-600 text-white hover:from-safety-600 hover:to-orange-700 hover:scale-105 hover:shadow-lg hover:shadow-orange-500/50",
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

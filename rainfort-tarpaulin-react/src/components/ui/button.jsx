import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold uppercase tracking-wider text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-navy-500 to-navy-600 text-white border-2 border-navy-700 hover:from-navy-600 hover:to-navy-700 hover:scale-105 hover:shadow-xl active:scale-95 heavy-shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-lg",
        outline:
          "border-2 border-navy-500 bg-background text-navy-500 hover:bg-gradient-to-r hover:from-navy-500 hover:to-navy-600 hover:text-white hover:scale-105 hover:shadow-lg active:scale-95 rounded-lg",
        secondary:
          "bg-gradient-to-r from-charcoal-500 to-charcoal-600 text-white border-2 border-charcoal-700 hover:from-charcoal-600 hover:to-charcoal-700 hover:scale-105 hover:shadow-xl active:scale-95 heavy-shadow",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground rounded-lg",
        link: "text-primary underline-offset-4 hover:underline rounded-none",
        accent: "bg-gradient-to-r from-safety-500 to-orange-600 text-white border-2 border-orange-700 hover:from-safety-600 hover:to-orange-700 hover:scale-105 hover:shadow-xl hover:shadow-orange-500/50 active:scale-95 heavy-shadow",
      },
      size: {
        default: "h-12 px-6 py-3",
        sm: "h-10 px-4 py-2 text-xs",
        lg: "h-14 px-8 py-4 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

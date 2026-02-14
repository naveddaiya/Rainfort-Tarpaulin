import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold uppercase tracking-wider text-sm transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 rounded-lg",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-navy-500 to-navy-600 text-white border-2 border-navy-700 hover:from-navy-600 hover:to-navy-700 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-navy-500/30 hover:brightness-110 active:scale-[0.98] active:translate-y-0 heavy-shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98] active:translate-y-0 rounded-lg",
        outline:
          "border-2 border-navy-500 bg-background text-navy-500 hover:bg-gradient-to-r hover:from-navy-500 hover:to-navy-600 hover:text-white hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-lg hover:shadow-navy-500/20 active:scale-[0.98] active:translate-y-0 rounded-lg",
        secondary:
          "bg-gradient-to-r from-charcoal-500 to-charcoal-600 text-white border-2 border-charcoal-700 hover:from-charcoal-600 hover:to-charcoal-700 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-2xl hover:brightness-110 active:scale-[0.98] active:translate-y-0 heavy-shadow",
        ghost: "hover:bg-accent/10 hover:text-accent-foreground hover:scale-[1.02] active:scale-[0.98] rounded-lg",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80 rounded-none",
        accent: "bg-gradient-to-r from-safety-500 to-orange-600 text-white border-2 border-orange-700 hover:from-safety-600 hover:to-orange-700 hover:scale-[1.02] hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-orange-500/40 hover:brightness-110 active:scale-[0.98] active:translate-y-0 heavy-shadow",
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

import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap font-bold uppercase tracking-wider text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-navy-500 text-white border-2 border-navy-600 hover:bg-navy-600 hover:translate-y-[-2px] active:translate-y-0 heavy-shadow",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border-2 border-navy-500 bg-background text-navy-500 hover:bg-navy-500 hover:text-white hover:translate-y-[-2px] active:translate-y-0",
        secondary:
          "bg-charcoal-500 text-white border-2 border-charcoal-600 hover:bg-charcoal-600 hover:translate-y-[-2px] active:translate-y-0 heavy-shadow",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-safety-500 text-white border-2 border-safety-600 hover:bg-safety-600 hover:translate-y-[-2px] active:translate-y-0 heavy-shadow",
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

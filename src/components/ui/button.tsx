import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "premium" | "gold";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      premium: "bg-slate-950 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 font-semibold shadow-xl hover:shadow-slate-500/20",
      gold: "gold-gradient text-white hover:brightness-110 font-bold shadow-lg shadow-gold-500/20 border-none transition-all duration-300",
    };

    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-lg px-4 text-xs",
      lg: "h-14 rounded-2xl px-10 text-base",
      icon: "h-10 w-10 rounded-xl",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

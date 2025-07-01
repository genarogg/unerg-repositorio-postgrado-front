import type React from "react"
import "./button.css"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline"
  size?: "sm" | "md" | "lg"
  loading?: boolean
  children: React.ReactNode
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const buttonClass = [
    "button", 
    `button--${variant}`, 
    `button--${size}`, 
    loading && "button--loading", 
    className
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button className={buttonClass} disabled={disabled || loading} {...props}>
      {loading && <span className="button__spinner" />}
      {children}
    </button>
  )
}

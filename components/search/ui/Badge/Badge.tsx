import type React from "react"
import "./badge.css"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "success" | "warning" | "error"
  size?: "sm" | "md"
  className?: string
}

export function Badge({ children, variant = "default", size = "md", className = "" }: BadgeProps) {
  const badgeClass = `badge badge-${variant} badge-${size} ${className}`.trim()

  return <span className={badgeClass}>{children}</span>
}

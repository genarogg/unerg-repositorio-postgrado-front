import type React from "react"
import "./card.css"

interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: "none" | "sm" | "md" | "lg"
  shadow?: "none" | "sm" | "md" | "lg"
}

export function Card({ children, className = "", padding = "md", shadow = "sm" }: CardProps) {
  const cardClass = ["card", `padding-${padding}`, `shadow-${shadow}`, className]
    .filter(Boolean)
    .join(" ")

  return <div className={cardClass}>{children}</div>
}

import React from "react"
import "./input.css"

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, rightIcon, className = "", ...props }, ref) => {
    const inputClass = [
      "input",
      leftIcon && "hasLeftIcon",
      rightIcon && "hasRightIcon",
      error && "error",
      className,
    ]
      .filter(Boolean)
      .join(" ")

    return (
      <div className="container">
        {label && <label className="label">{label}</label>}
        <div className="inputWrapper">
          {leftIcon && <div className="leftIcon">{leftIcon}</div>}
          <input ref={ref} className={inputClass} {...props} />
          {rightIcon && <div className="rightIcon">{rightIcon}</div>}
        </div>
        {error && <span className="errorText">{error}</span>}
      </div>
    )
  },
)

Input.displayName = "Input"

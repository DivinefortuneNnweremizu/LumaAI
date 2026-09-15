import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      isLoading = false,
      disabled,
      className = "",
      ...props
    },
    ref
  ) => {
    let baseStyle =
      "inline-flex items-center justify-center font-semibold transition-all rounded-md focus-visible:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none";

    let variantStyle = "";
    switch (variant) {
      case "primary":
        variantStyle = "bg-primary text-on-primary hover:opacity-95 shadow-sm";
        break;
      case "secondary":
        variantStyle =
          "bg-secondary text-on-secondary hover:opacity-95 shadow-sm";
        break;
      case "outline":
        variantStyle =
          "border border-outline text-on-surface hover:bg-surface-container";
        break;
      case "ghost":
        variantStyle = "text-on-surface hover:bg-surface-container";
        break;
      case "destructive":
        variantStyle = "bg-error text-on-error hover:opacity-95 shadow-sm";
        break;
    }

    let sizeStyle = "";
    switch (size) {
      case "sm":
        sizeStyle = "text-xs px-3 py-1.5 min-h-[36px]";
        break;
      case "md":
        sizeStyle = "text-sm px-4 py-2 min-h-[44px]";
        break;
      case "lg":
        sizeStyle = "text-base px-6 py-3 min-h-[48px]";
        break;
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Processing...</span>
          </span>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

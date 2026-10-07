import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label htmlFor={inputId} className="text-xs font-semibold text-on-surface">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full min-h-[44px] px-3.5 py-2.5 rounded-md bg-surface text-on-surface border text-sm transition-all placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-1 ${
            error
              ? "border-error hover:border-error focus:border-error focus:ring-error"
              : "border-outline-variant hover:border-outline focus:border-primary focus:ring-primary"
          } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-error font-medium">{error}</span>}
        {!error && helperText && (
          <span className="text-xs text-on-surface-variant">{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

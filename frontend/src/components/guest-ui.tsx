import React from "react";
import { cn } from "@/lib/utils";

// Guest Container Component
export function GuestContainer({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("guest-container", className)} {...props}>
      {children}
    </div>
  );
}

// Guest Card Component
export function GuestCard({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("guest-card", className)} {...props}>
      {children}
    </div>
  );
}

// Guest Button Component
interface GuestButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

export function GuestButton({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  disabled,
  ...props
}: GuestButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "text-white bg-orange-600 hover:bg-orange-700 focus:ring-orange-500 shadow-sm",
    secondary:
      "text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 focus:ring-gray-500",
    outline:
      "text-orange-600 dark:text-orange-400 bg-transparent border border-orange-600 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 focus:ring-orange-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        (loading || disabled) && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <div className="loading-dots mr-2">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}
      {children}
    </button>
  );
}

// Guest Input Component
interface GuestInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function GuestInput({
  label,
  error,
  className,
  id,
  ...props
}: GuestInputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "guest-input",
          error && "border-red-500 focus:ring-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}

// Guest Badge Component
interface GuestBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error";
}

export function GuestBadge({
  children,
  className,
  variant = "default",
  ...props
}: GuestBadgeProps) {
  const variants = {
    default:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300",
    success:
      "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300",
    warning:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300",
    error: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Guest Loading Component
export function GuestLoading({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center justify-center p-8", className)}
      {...props}
    >
      <div className="loading-dots text-orange-600">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
}

// Guest Section Component
interface GuestSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string;
  description?: string;
}

export function GuestSection({
  title,
  description,
  children,
  className,
  ...props
}: GuestSectionProps) {
  return (
    <section className={cn("space-y-6", className)} {...props}>
      {(title || description) && (
        <div className="space-y-2">
          {title && (
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Guest Page Header Component
interface GuestPageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function GuestPageHeader({
  title,
  subtitle,
  action,
}: GuestPageHeaderProps) {
  return (
    <div className="guest-container py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
}

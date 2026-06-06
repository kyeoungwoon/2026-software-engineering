import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import React from "react";

import { cn } from "../primitives";
import LeftChevronIcon from "./icons/left-chevron-icon";
import PlusIcon from "./icons/plus-icon";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-[10px] text-label-1-medium leading-none transition-colors disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-55",
  {
    variants: {
      variant: {
        fill: "",
        weak: "",
      },
      color: {
        primary: "",
        neutral: "",
        white: "",
      },
      size: {
        xl: "h-14 min-h-14 min-w-24 py-1 px-8 gap-2.5 text-heading-7-semibold",
        lg: "h-[50px] min-h-11 min-w-[84px] py-1 px-4 gap-2.5 rounded-[10px] text-heading-7-semibold",
        m: "h-11 min-w-[90px] px-4",
        s: "h-10 min-w-[74px] px-5",
        xs: "h-[34px] pt-0.5",
      },
    },
    compoundVariants: [
      {
        variant: "fill",
        color: "primary",
        className:
          "bg-ds-primary text-white hover:bg-ds-primary-strong disabled:bg-teal-300 disabled:text-teal-gray-50",
      },
      {
        variant: "weak",
        color: "primary",
        className:
          "bg-ds-primary-soft text-ds-primary-strong hover:bg-teal-100 disabled:bg-ds-primary-soft disabled:text-teal-gray-400",
      },
      {
        variant: "fill",
        color: "neutral",
        className:
          "bg-teal-gray-900 text-white hover:bg-teal-gray-800 disabled:bg-teal-gray-200 disabled:text-teal-gray-400",
      },
      {
        variant: "weak",
        color: "neutral",
        className:
          "bg-teal-gray-100 text-teal-gray-700 hover:bg-teal-gray-150 disabled:bg-teal-gray-100 disabled:text-teal-gray-400",
      },
      {
        variant: "fill",
        color: "white",
        size: "xs",
        className:
          "shadow-inner-neutral-2 bg-teal-gray-50 text-teal-gray-600 hover:bg-teal-gray-100 disabled:bg-teal-gray-50 disabled:text-teal-gray-400",
      },
      {
        variant: "weak",
        color: "white",
        size: "xs",
        className:
          "shadow-inner-neutral-2 bg-transparent text-teal-gray-600 hover:bg-teal-gray-50 disabled:bg-transparent disabled:text-teal-gray-400",
      },
    ],
    defaultVariants: {
      variant: "fill",
      color: "primary",
      size: "m",
    },
  },
);

export interface ButtonProps
  extends
    Omit<React.ComponentProps<"button">, "color" | "class">,
    VariantProps<typeof buttonVariants> {
  href?: string;
  isLoading?: boolean;
  asChild?: boolean;
  icon?: boolean;
  class?: string;
}

export function Button({
  class: astroClassName,
  className,
  variant,
  color,
  size,
  isLoading = false,
  asChild = false,
  icon = false,
  href,
  disabled,
  children,
  ...props
}: ButtonProps) {
  const leftIcon = (() => {
    if (!icon) return null;
    if (size === "xs") {
      const iconColor = cn(
        color === "white" && !disabled && "text-teal-gray-400",
        color === "white" && disabled && "text-teal-gray-300",
      );
      return <LeftChevronIcon width={16} height={16} className={iconColor} />;
    }
    const plusIconColor = cn(
      variant === "fill" &&
        color === "primary" &&
        !disabled &&
        "text-white group-hover:text-teal-50",
      variant === "fill" && color === "primary" && disabled && "text-teal-50",
      variant === "weak" && color === "primary" && !disabled && "text-teal-600",
      variant === "weak" && color === "primary" && disabled && "text-teal-300",
    );
    return <PlusIcon width={16} height={16} className={plusIconColor} />;
  })();

  const buttonClassName = cn(
    "group",
    buttonVariants({ variant, color, size }),
    size === "xs" && (icon ? "pr-3.5 pl-2" : "w-14.5 min-w-14.5 rounded-[8px]"),
    size === "m" && "rounded-[10px]",
    icon && size === "s" && "min-h-10 rounded-[10px] py-1 pr-4 pl-2.5",
    icon && size === "m" && "min-h-11 min-w-19 py-1 pr-4 pl-3",
    isLoading && "pointer-events-none cursor-default select-none",
    isLoading &&
      variant === "fill" &&
      color === "primary" &&
      "bg-ds-primary-strong",
    isLoading &&
      variant === "weak" &&
      color === "primary" &&
      "bg-ds-primary-soft",
    isLoading &&
      variant === "fill" &&
      color === "neutral" &&
      "bg-teal-gray-800",
    isLoading &&
      variant === "weak" &&
      color === "neutral" &&
      "bg-teal-gray-150",
    className,
    astroClassName,
  );

  const content = (
    <>
      {isLoading ? (
        <>
          <span className="sr-only">로딩 중</span>
          <span className="flex items-center gap-1.25" aria-hidden="true">
            <span className="animation-duration-[1000ms] h-2 w-2 animate-pulse rounded-full bg-current opacity-100" />
            <span className="animation-duration-[1000ms] h-2 w-2 animate-pulse rounded-full bg-current opacity-60 [animation-delay:75ms]" />
            <span className="animation-duration-[1000ms] h-2 w-2 animate-pulse rounded-full bg-current opacity-20 [animation-delay:150ms]" />
          </span>
        </>
      ) : leftIcon ? (
        <span className="flex items-center gap-1 whitespace-nowrap">
          {leftIcon}
          {children}
        </span>
      ) : (
        children
      )}
    </>
  );

  if (asChild) {
    return (
      <Slot.Root
        aria-busy={isLoading || undefined}
        aria-disabled={disabled || undefined}
        className={buttonClassName}
        {...props}
      >
        {content}
      </Slot.Root>
    );
  }

  if (href) {
    const anchorProps = props as Omit<
      React.ComponentProps<"a">,
      "className" | "href"
    >;
    return (
      <a
        {...anchorProps}
        aria-busy={isLoading || undefined}
        aria-disabled={disabled || undefined}
        className={buttonClassName}
        href={disabled ? undefined : href}
        tabIndex={disabled ? -1 : anchorProps.tabIndex}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type="button"
      aria-busy={isLoading || undefined}
      disabled={disabled}
      className={buttonClassName}
      {...props}
    >
      {content}
    </button>
  );
}

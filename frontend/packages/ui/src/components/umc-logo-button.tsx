import React from "react";

import { cn } from "../primitives";
import { AuthIcon } from "./auth-icon";

export interface UmcLogoButtonProps extends Omit<
  React.ComponentProps<"button">,
  "class"
> {
  href?: string;
  class?: string;
}

export function UmcLogoButton({
  href,
  class: astroClassName,
  className,
  children,
  ...props
}: UmcLogoButtonProps) {
  const content = (
    <>
      <AuthIcon icon="umc" className="h-auto w-[160px]" />
      <p className="text-label-2-medium h-5">UNIVERSITY MAKEUS CHALLENGE</p>
      {children}
    </>
  );
  const logoClassName = cn(
    "text-teal-gray-900 flex flex-col items-center gap-4 text-center",
    className,
    astroClassName,
  );

  if (href) {
    const anchorProps = props as Omit<
      React.ComponentProps<"a">,
      "className" | "href"
    >;
    return (
      <a className={logoClassName} href={href} {...anchorProps}>
        {content}
      </a>
    );
  }

  return (
    <button className={logoClassName} type="button" {...props}>
      {content}
    </button>
  );
}

import React from "react";

import { cn } from "../primitives";
import { AuthIcon, type SocialProvider } from "./auth-icon";

export interface SocialIconButtonProps extends Omit<
  React.ComponentProps<"button">,
  "class"
> {
  social: SocialProvider;
  label?: string;
  attr?: string;
  class?: string;
}

const defaultLabelBySocial: Record<SocialProvider, string> = {
  apple: "Apple 로그인",
  google: "Google 로그인",
  kakao: "카카오 로그인",
  github: "Github 로그인",
};

const buttonClassBySocial: Record<SocialProvider, string> = {
  apple: "bg-teal-gray-900",
  google: "border border-teal-gray-150 bg-white",
  kakao: "bg-[#FEE500]",
  github: "bg-teal-gray-800",
};

const iconClassBySocial: Record<SocialProvider, string> = {
  apple: "size-6 text-white",
  google: "size-6",
  kakao: "size-6 text-teal-gray-900",
  github: "size-6 text-white",
};

export function SocialIconButton({
  social,
  label = defaultLabelBySocial[social],
  attr,
  class: astroClassName,
  className,
  ...props
}: SocialIconButtonProps) {
  const dataAttribute = { [attr ?? `data-login-${social}`]: "" };

  return (
    <button
      className={cn(
        "inline-flex size-[54px] items-center justify-center rounded-full",
        buttonClassBySocial[social],
        className,
        astroClassName,
      )}
      type="button"
      aria-label={label}
      {...dataAttribute}
      {...props}
    >
      <AuthIcon icon={social} className={iconClassBySocial[social]} />
    </button>
  );
}

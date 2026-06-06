import React from "react";

import { cn } from "../primitives";
import { AuthIcon, type SocialProvider } from "./auth-icon";

export type SocialAuthAppearance = "black" | "white" | "yellow" | "dark";

export interface SocialAuthButtonProps extends Omit<
  React.ComponentProps<"button">,
  "class"
> {
  social: SocialProvider;
  label?: string;
  attr?: string;
  appearance?: SocialAuthAppearance;
  hidden?: boolean;
  class?: string;
}

const defaultLabelBySocial: Record<SocialProvider, string> = {
  apple: "Apple 로그인",
  google: "Google 로그인",
  kakao: "카카오 로그인",
  github: "Github 로그인",
};

const defaultAppearanceBySocial: Record<SocialProvider, SocialAuthAppearance> =
  {
    apple: "black",
    google: "white",
    kakao: "yellow",
    github: "dark",
  };

const buttonClassByAppearance: Record<SocialAuthAppearance, string> = {
  black: "bg-teal-gray-900 hover:bg-teal-gray-800",
  white: "border border-teal-gray-300 bg-white hover:bg-teal-gray-50",
  yellow: "bg-[#FEE500] hover:bg-[#F9E108]",
  dark: "bg-teal-gray-800 hover:bg-teal-gray-900",
};

const foregroundClassByAppearance: Record<SocialAuthAppearance, string> = {
  black: "text-white",
  white: "text-teal-gray-900",
  yellow: "text-teal-gray-900",
  dark: "text-white",
};

const iconClassBySocial: Record<SocialProvider, string> = {
  apple: "size-6",
  google: "size-5",
  kakao: "size-5",
  github: "size-5",
};

export function SocialAuthButton({
  social,
  label = defaultLabelBySocial[social],
  attr,
  appearance,
  hidden = false,
  class: astroClassName,
  className,
  ...props
}: SocialAuthButtonProps) {
  if (hidden) return null;

  const currentAppearance = appearance ?? defaultAppearanceBySocial[social];
  const foregroundClass = foregroundClassByAppearance[currentAppearance];
  const dataAttribute = { [attr ?? `data-login-${social}`]: "" };

  return (
    <button
      className={cn(
        "flex h-12 min-h-12 w-full max-w-[360px] items-center justify-center rounded-[10px] px-7 transition-colors",
        buttonClassByAppearance[currentAppearance],
        className,
        astroClassName,
      )}
      type="button"
      {...dataAttribute}
      {...props}
    >
      <span
        className={cn(
          "flex items-center justify-center gap-3",
          foregroundClass,
        )}
      >
        <AuthIcon
          icon={social}
          className={cn(iconClassBySocial[social], foregroundClass)}
        />
        <span className="text-label-1-medium">{label}</span>
      </span>
    </button>
  );
}

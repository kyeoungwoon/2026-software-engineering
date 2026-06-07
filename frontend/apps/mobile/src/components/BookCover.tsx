import { BookOpen } from "lucide-react";
import { useState } from "react";

import { cn } from "@umc/ui";

import { resolveImageUrl } from "../utils/images";

type BookCoverProps = {
  src?: string | null | undefined;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string | undefined;
};

const sizeClass = {
  sm: "h-20 w-16",
  md: "h-24 w-18",
  lg: "h-60 w-full",
} satisfies Record<NonNullable<BookCoverProps["size"]>, string>;

export function BookCover({ src, title, size = "md", className }: BookCoverProps) {
  const [failed, setFailed] = useState(false);
  const imageUrl = failed ? undefined : resolveImageUrl(src);

  return (
    <div
      className={cn(
        "relative isolate flex shrink-0 overflow-hidden rounded-[10px] border border-teal-gray-200 bg-teal-50 text-teal-700 shadow-inner-neutral-2",
        sizeClass[size],
        className,
      )}
    >
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`${title} 표지`}
          className="h-full w-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(145deg,#f4fbfa,#d8f0ed)] p-2">
          <BookOpen className="h-5 w-5 text-teal-600" aria-hidden="true" />
          <span className="line-clamp-3 text-[11px] leading-[1.25] font-semibold text-teal-gray-800">
            {title}
          </span>
        </div>
      )}
    </div>
  );
}

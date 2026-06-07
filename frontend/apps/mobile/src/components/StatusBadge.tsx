import { cn } from "@umc/ui";

import type { TradePostStatus } from "../api/types";

type StatusBadgeProps = {
  status: TradePostStatus;
};

const statusLabel = {
  AVAILABLE: "판매중",
  RESERVED: "예약중",
  SOLD: "거래완료",
} satisfies Record<TradePostStatus, string>;

const statusClass = {
  AVAILABLE: "bg-teal-50 text-teal-700 border-teal-200",
  RESERVED: "bg-warning-50 text-warning-700 border-warning-200",
  SOLD: "bg-teal-gray-100 text-teal-gray-500 border-teal-gray-200",
} satisfies Record<TradePostStatus, string>;

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex h-6 shrink-0 items-center rounded-full border px-2 text-[11px] leading-none font-medium",
        statusClass[status],
      )}
    >
      {statusLabel[status]}
    </span>
  );
}

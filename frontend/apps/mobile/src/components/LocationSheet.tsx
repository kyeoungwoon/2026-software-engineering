import { Check, MapPin } from "lucide-react";

import { Button, cn } from "@umc/ui";

import type { LocationPreset } from "../api/types";
import { BottomSheet } from "./BottomSheet";

type LocationSheetProps = {
  open: boolean;
  locations: LocationPreset[];
  selected: LocationPreset | null;
  onSelect: (location: LocationPreset) => void;
  onOpenChange: (open: boolean) => void;
};

export function LocationSheet({
  open,
  locations,
  selected,
  onSelect,
  onOpenChange,
}: LocationSheetProps) {
  return (
    <BottomSheet open={open} title="동네 선택" onOpenChange={onOpenChange}>
      <div className="space-y-3 px-5 py-4">
        {locations.map((location) => {
          const active = selected?.id === location.id;
          return (
            <button
              key={location.id}
              type="button"
              onClick={() => onSelect(location)}
              className={cn(
                "flex w-full items-center gap-3 rounded-[14px] border p-4 text-left transition",
                active
                  ? "border-teal-500 bg-teal-50"
                  : "border-teal-gray-200 bg-white hover:bg-teal-gray-50",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  active ? "bg-teal-500 text-white" : "bg-teal-gray-100 text-teal-gray-500",
                )}
              >
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-label-1-semibold text-teal-gray-900">
                  {location.label}
                </span>
                <span className="mt-0.5 block text-body-3-regular text-teal-gray-500">
                  {location.description} · {location.radiusLabel}
                </span>
              </span>
              {active && <Check className="h-5 w-5 text-teal-600" aria-hidden="true" />}
            </button>
          );
        })}
        {locations.length === 0 && (
          <p className="m-0 rounded-[14px] bg-teal-gray-50 px-4 py-5 text-center text-body-2-regular text-teal-gray-500">
            동네 목록을 불러오는 중입니다.
          </p>
        )}
        <Button size="lg" className="mt-2 w-full" onClick={() => onOpenChange(false)}>
          이 동네로 보기
        </Button>
      </div>
    </BottomSheet>
  );
}

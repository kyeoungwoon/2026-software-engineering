import { X } from "lucide-react";
import type { ReactNode } from "react";

import { Modal, cn } from "@umc/ui";

type BottomSheetProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  className?: string;
  onOpenChange: (open: boolean) => void;
};

export function BottomSheet({
  open,
  title,
  children,
  className,
  onOpenChange,
}: BottomSheetProps) {
  return (
    <Modal.Root open={open} onOpenChange={onOpenChange}>
      <Modal.Portal>
        <Modal.Overlay tone="light" />
        <Modal.Content
          className={cn(
            "fixed right-0 bottom-0 left-0 top-auto mx-auto max-h-[88dvh] w-full max-w-[430px] translate-x-0 translate-y-0 overflow-hidden rounded-t-[24px] bg-white shadow-drop-neutral-1 focus:outline-none",
            className,
          )}
        >
          <div className="flex items-center justify-between border-b border-teal-gray-100 px-5 py-4">
            <Modal.Title className="m-0 text-heading-7-semibold text-teal-gray-900">
              {title}
            </Modal.Title>
            <Modal.Description className="sr-only">
              {title} 항목을 선택하거나 닫을 수 있습니다.
            </Modal.Description>
            <Modal.Close
              className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-gray-50 text-teal-gray-600 transition hover:bg-teal-gray-100"
              aria-label="닫기"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </Modal.Close>
          </div>
          {children}
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  );
}

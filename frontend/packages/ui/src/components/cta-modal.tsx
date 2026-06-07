import React from "react";

import { cn } from "../primitives";
import { Modal } from "./modal";

export type CtaModalVariant = "success" | "warning" | "error";
export type CtaModalSize = "small" | "medium" | "large";

type CtaModalWidthStyle = React.CSSProperties & {
  "--umc-cta-modal-width": string;
  width: string;
};

export interface CtaModalProps {
  open: boolean;
  title: string;
  content?: React.ReactNode;
  cancelText?: string;
  confirmText: string;
  variant?: CtaModalVariant;
  size?: CtaModalSize;
  overlayTone?: "light" | "deep";
  onOpenChange: (open: boolean) => void;
  onCancel?: () => void;
  onConfirm: () => void;
}

const ctaModalWidthBySize = {
  small: "320px",
  medium: "360px",
  large: "480px",
} satisfies Record<CtaModalSize, string>;

export function getCtaModalContentClassName() {
  return cn("overflow-hidden rounded-[24px] bg-white focus:outline-none");
}

export function getCtaModalBodyClassName() {
  return cn("flex flex-col gap-5 px-6 py-6");
}

export function getCtaModalWidthStyle(size: CtaModalSize): CtaModalWidthStyle {
  return {
    "--umc-cta-modal-width": ctaModalWidthBySize[size],
    width: "min(var(--umc-cta-modal-width), calc(100vw - 40px))",
  };
}

export function CtaModal({
  open,
  title,
  content,
  cancelText,
  confirmText,
  variant = "warning",
  size = "medium",
  overlayTone = "light",
  onOpenChange,
  onCancel,
  onConfirm,
}: CtaModalProps) {
  const confirmButtonClassName =
    variant === "error"
      ? "bg-error-500 hover:bg-error-600 disabled:bg-error-200"
      : "bg-ds-primary text-white hover:bg-ds-primary-strong disabled:bg-teal-300";

  const hasCancel = Boolean(cancelText);
  const hasContent = content !== undefined && content !== null && content !== "";

  return (
    <Modal.Root
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen);
        if (!nextOpen) onCancel?.();
      }}
    >
      <Modal.Portal>
        <Modal.Overlay tone={overlayTone} />
        <Modal.Content
          className={getCtaModalContentClassName()}
          style={getCtaModalWidthStyle(size)}
        >
          <div className={getCtaModalBodyClassName()}>
            <div className="grid gap-2 text-left">
              <Modal.Title className="text-heading-6-semibold text-teal-gray-900 m-0">
                {title}
              </Modal.Title>
              {hasContent && (
                <Modal.Description className="text-body-2-regular text-teal-gray-600 m-0 whitespace-pre-line">
                  {content}
                </Modal.Description>
              )}
              {!hasContent && (
                <Modal.Description className="sr-only">{title}</Modal.Description>
              )}
            </div>

            <div
              className={cn(
                "grid gap-2",
                hasCancel ? "grid-cols-2" : "grid-cols-1",
              )}
            >
              {hasCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-label-1-medium bg-teal-gray-100 text-teal-gray-800 hover:bg-teal-gray-150 inline-flex min-h-12 items-center justify-center rounded-[12px] px-4 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:outline-none"
                >
                  {cancelText}
                </button>
              )}
              <button
                type="button"
                onClick={onConfirm}
                className={cn(
                  "text-label-1-medium inline-flex min-h-12 items-center justify-center rounded-[12px] px-4 whitespace-nowrap transition-colors focus-visible:ring-2 focus-visible:ring-teal-300 focus-visible:ring-offset-2 focus-visible:outline-none",
                  confirmButtonClassName,
                )}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </Modal.Content>
      </Modal.Portal>
    </Modal.Root>
  );
}

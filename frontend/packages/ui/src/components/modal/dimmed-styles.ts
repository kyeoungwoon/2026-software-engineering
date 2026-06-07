import { cva, type VariantProps } from "class-variance-authority";

export const dimmedToneVariants = cva("fixed inset-0", {
  variants: {
    tone: {
      light: "bg-[rgba(22,25,25,0.42)]",
      deep: "bg-neutral-900/85",
    },
  },
  defaultVariants: {
    tone: "deep",
  },
});

export type DimmedToneProps = VariantProps<typeof dimmedToneVariants>;

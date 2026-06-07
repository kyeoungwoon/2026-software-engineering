import { useState } from "react";

import { Button, CtaModal } from "@umc/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { CtaModalProps } from "@umc/ui";

type CtaModalStoryArgs = Omit<
  CtaModalProps,
  "open" | "onOpenChange" | "onCancel" | "onConfirm"
>;

function CtaModalPreview(args: CtaModalStoryArgs) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <CtaModal
        {...args}
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={() => setOpen(false)}
        onOpenChange={setOpen}
      />
    </>
  );
}

const meta = {
  title: "UI/CtaModal",
  component: CtaModalPreview,
  args: {
    cancelText: "닫기",
    confirmText: "확인",
    content: "모달 본문은 이 영역에 표시됩니다.",
    overlayTone: "light",
    size: "medium",
    title: "CTA 모달",
    variant: "warning",
  },
  argTypes: {
    overlayTone: {
      control: "select",
      options: ["light", "deep"],
    },
    size: {
      control: "select",
      options: ["small", "medium", "large"],
    },
    variant: {
      control: "select",
      options: ["success", "warning", "error"],
    },
  },
} satisfies Meta<typeof CtaModalPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <CtaModalPreview {...args} />,
};

export const Error: Story = {
  args: {
    confirmText: "삭제",
    content: "이 작업은 되돌릴 수 없습니다.",
    title: "정말 삭제할까요?",
    variant: "error",
  },
  render: (args) => <CtaModalPreview {...args} />,
};

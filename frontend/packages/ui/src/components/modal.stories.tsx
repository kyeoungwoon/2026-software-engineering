import { useState } from "react";

import { Button, Modal } from "@umc/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "UI/Modal",
  component: Modal.Content,
} satisfies Meta<typeof Modal.Content>;

export default meta;

type Story = StoryObj<typeof meta>;

function ModalPreview() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>모달 열기</Button>
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Portal>
          <Modal.Overlay tone="light" />
          <Modal.Content className="w-[min(360px,calc(100vw-40px))] rounded-[24px] bg-white p-6 focus:outline-none">
            <div className="grid gap-5">
              <div className="grid gap-2 text-left">
                <Modal.Title className="text-heading-6-semibold text-teal-gray-900 m-0">
                  기본 모달
                </Modal.Title>
                <Modal.Description className="text-body-2-regular text-teal-gray-600 m-0">
                  Modal primitive 조합을 확인합니다.
                </Modal.Description>
              </div>
              <Button onClick={() => setOpen(false)}>닫기</Button>
            </div>
          </Modal.Content>
        </Modal.Portal>
      </Modal.Root>
    </>
  );
}

export const Playground: Story = {
  render: () => <ModalPreview />,
};

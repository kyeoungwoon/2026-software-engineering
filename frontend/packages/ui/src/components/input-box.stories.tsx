import { useState } from "react";

import { InputBox } from "@umc/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";

import type { InputBoxProps } from "@umc/ui";

type InputBoxStoryArgs = Omit<
  InputBoxProps,
  "value" | "onChange" | "onClear"
> & {
  initialValue?: string;
};

function InputBoxPreview({ initialValue = "", ...args }: InputBoxStoryArgs) {
  const [value, setValue] = useState(initialValue);

  return (
    <InputBox
      {...args}
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onClear={() => setValue("")}
    />
  );
}

const meta = {
  title: "UI/InputBox",
  component: InputBoxPreview,
  args: {
    initialValue: "",
    placeholder: "내용을 입력하세요",
    size: "md",
    state: "default",
    type: "default",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["md", "sm"],
    },
    state: {
      control: "select",
      options: ["default", "success", "error", "disabled"],
    },
    type: {
      control: "select",
      options: ["default", "clear", "password", "verification"],
    },
  },
} satisfies Meta<typeof InputBoxPreview>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <InputBoxPreview {...args} />,
};

export const States: Story = {
  render: () => (
    <div className="grid gap-3">
      <InputBox
        value=""
        onChange={() => undefined}
        placeholder="Default"
        state="default"
      />
      <InputBox value="Success" onChange={() => undefined} state="success" />
      <InputBox value="Error" onChange={() => undefined} state="error" />
      <InputBox value="Disabled" onChange={() => undefined} state="disabled" />
    </div>
  ),
};

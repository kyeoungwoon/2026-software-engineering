import { Button } from "@umc/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    children: "Button",
    color: "primary",
    disabled: false,
    icon: false,
    isLoading: false,
    size: "m",
    variant: "fill",
  },
  argTypes: {
    color: {
      control: "select",
      options: ["primary", "neutral", "white"],
    },
    size: {
      control: "select",
      options: ["xl", "lg", "m", "s", "xs"],
    },
    variant: {
      control: "select",
      options: ["fill", "weak"],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="grid gap-4">
      {(["primary", "neutral", "white"] as const).map((color) => (
        <div key={color} className="flex flex-wrap items-center gap-3">
          <Button color={color} variant="fill">
            {color} fill
          </Button>
          <Button color={color} variant="weak">
            {color} weak
          </Button>
          <Button color={color} variant="fill" disabled>
            disabled
          </Button>
        </div>
      ))}
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      {(["xl", "lg", "m", "s", "xs"] as const).map((size) => (
        <Button key={size} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

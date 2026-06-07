import { SocialAuthButton } from "@umc/ui";

import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "UI/SocialAuthButton",
  component: SocialAuthButton,
  args: {
    social: "google",
  },
  argTypes: {
    appearance: {
      control: "select",
      options: ["black", "white", "yellow", "dark"],
    },
    social: {
      control: "select",
      options: ["apple", "google", "kakao", "github"],
    },
  },
} satisfies Meta<typeof SocialAuthButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Providers: Story = {
  render: () => (
    <div className="grid w-[360px] gap-3">
      <SocialAuthButton social="google" />
      <SocialAuthButton social="kakao" />
      <SocialAuthButton social="apple" />
      <SocialAuthButton social="github" />
    </div>
  ),
};

import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@spek/ui";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Components/Badge",
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {
  args: {
    children: "Primary",
  },
};

export const Secondary: Story = {
  args: {
    color: "secondary",
    children: "Login",
  },
};

export const Minimal: Story = {
  args: {
    color: "minimal",
    children: "Help",
  },
};

export const Destructive: Story = {
  args: {
    color: "destructive",
  },
};

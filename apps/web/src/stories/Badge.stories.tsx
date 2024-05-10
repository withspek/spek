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
    children: "Login",
  },
};

export const Minimal: Story = {
  args: {
    children: "Help",
  },
};

export const Destructive: Story = {
  args: {},
};

export const Example: Story = {
  render: () => <div className="space-x-3"></div>,
};

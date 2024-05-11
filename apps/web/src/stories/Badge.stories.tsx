import type { Meta, StoryObj } from "@storybook/react";

import { Badge } from "@spek/ui";

const meta: Meta<typeof Badge> = {
  component: Badge,
  title: "Components/Badge",
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    children: "Badge",
    withDot: true,
  },
};

export const Error: Story = {
  args: {
    variant: "error",
    children: "Badge",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
    children: "Badge",
    size: "lg",
  },
};

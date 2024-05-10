import type { Meta, StoryObj } from "@storybook/react";

import { Button } from "@spek/ui";
import { PlusIcon, SettingsIcon } from "@/icons";

const meta: Meta<typeof Button> = {
  component: Button,
  title: "Components/Button",
};

export default meta;
type Story = StoryObj<typeof Button>;

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
    children: <PlusIcon className="rotate-45" />,
  },
};

export const Example: Story = {
  render: () => (
    <div className="space-x-3">
      <Button color="primary" startIcon={<SettingsIcon />}>
        Login with Github
      </Button>
      <Button color="secondary">Login with Github</Button>
      <Button color="minimal">Login with Github</Button>
    </div>
  ),
};

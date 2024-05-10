import type { Meta, StoryObj } from "@storybook/react";

import { Button, Icon } from "@spek/ui";

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
    children: <Icon name="plus" className="rotate-45" />,
  },
};

export const Example: Story = {
  render: () => (
    <div className="space-x-3">
      <Button
        color="primary"
        startIcon={<Icon name="github" width={16} height={16} />}
      >
        Login with Github
      </Button>
      <Button
        color="secondary"
        endIcon={<Icon name="gitlab" width={16} height={16} />}
      >
        Login with Gitlab
      </Button>
      <Button color="minimal">Login with Github</Button>
    </div>
  ),
};

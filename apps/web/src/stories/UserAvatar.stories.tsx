import type { Meta, StoryObj } from "@storybook/react";

import { UserAvatar as Avatar } from "@spek/ui";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "Components/UserAvatar",
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const UserAvatar: Story = {
  args: {
    online: true,
    user: {
      username: "",
      avatarUrl: "",
      displayName: "",
    },
    size: "xl",
  },
};

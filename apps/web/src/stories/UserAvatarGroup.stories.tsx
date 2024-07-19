import type { Meta, StoryObj } from "@storybook/react";

import { UserAvatarGroup as Avatar } from "@spek/ui";

const meta: Meta<typeof Avatar> = {
  component: Avatar,
  title: "Components/UserAvatar",
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const UserAvatarGroup: Story = {
  args: {
    truncateAfter: 3,
    size: "sm",
    users: [
      { avatarUrl: "jeuygfu", displayName: "wui", username: "eiufw" },
      { avatarUrl: "iruehiyehgrie", displayName: "uyu", username: "wruf" },
      { avatarUrl: "iruehiyehgrie", displayName: "uyu", username: "wruf" },
      { avatarUrl: "iruehiyehgrie", displayName: "uyu", username: "wruf" },
    ],
  },
};

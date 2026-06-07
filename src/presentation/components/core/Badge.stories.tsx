import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "Core/Badge",
  component: Badge,
  parameters: { layout: "centered" },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: "Default" } };
export const Success: Story = {
  args: { children: "Active", variant: "success" },
};
export const Danger: Story = {
  args: { children: "Inactive", variant: "danger" },
};
export const Warning: Story = {
  args: { children: "Pending", variant: "warning" },
};
export const Info: Story = { args: { children: "Info", variant: "info" } };

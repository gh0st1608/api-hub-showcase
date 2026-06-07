import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "./Button";

const meta: Meta<typeof Button> = {
  title: "Core/Button",
  component: Button,
  parameters: { layout: "centered" },
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "ghost", "danger", "danger-ghost"],
    },
    size: { control: "select", options: ["sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { children: "Primary Button", variant: "primary" },
};
export const Secondary: Story = {
  args: { children: "Secondary Button", variant: "secondary" },
};
export const Ghost: Story = {
  args: { children: "Ghost Button", variant: "ghost" },
};
export const Danger: Story = {
  args: { children: "Delete", variant: "danger" },
};
export const Loading: Story = {
  args: { children: "Saving...", loading: true },
};
export const Disabled: Story = {
  args: { children: "Disabled", disabled: true },
};
export const Small: Story = { args: { children: "Small", size: "sm" } };
export const Large: Story = { args: { children: "Large", size: "lg" } };

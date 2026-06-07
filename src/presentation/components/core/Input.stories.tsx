import type { Meta, StoryObj } from "@storybook/react-vite";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Core/Input",
  component: Input,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { label: "Name", placeholder: "Enter name" },
};
export const Required: Story = {
  args: { label: "Email", placeholder: "email@example.com", required: true },
};
export const WithError: Story = {
  args: { label: "Price", error: "Must be a positive number", value: "-1" },
};
export const WithHelper: Story = {
  args: { label: "Description", helperText: "Optional. Max 200 chars." },
};
export const Disabled: Story = {
  args: { label: "Readonly", value: "Cannot change", disabled: true },
};

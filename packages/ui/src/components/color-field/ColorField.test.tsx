import { fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { ColorField } from "./ColorField.js";

function ControlledColorField({ initial = "#1d4ed8" }: { initial?: string }) {
  const [value, setValue] = useState(initial);
  return (
    <>
      <ColorField label="Accent color" value={value} onChange={setValue} />
      <output>{value}</output>
    </>
  );
}

describe("ColorField", () => {
  it("names the text input with the label and the picker with label plus picker label", () => {
    render(<ColorField label="Accent color" value="#1d4ed8" onChange={() => {}} />);

    expect(screen.getByRole("textbox", { name: "Accent color" })).toHaveValue("#1d4ed8");
    expect(screen.getByLabelText("Accent color Pick color")).toHaveAttribute("type", "color");
  });

  it("reports only complete, valid colors while typing, normalized to lowercase", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<ColorField label="Accent color" value="#000000" onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Accent color" });
    await user.clear(input);
    await user.type(input, "#12AB");
    expect(onChange).not.toHaveBeenCalled();

    await user.type(input, "EF");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("#12abef");
  });

  it("keeps the typed spelling when the parent adopts the normalized value", async () => {
    const user = userEvent.setup();
    render(<ControlledColorField />);

    const input = screen.getByRole("textbox", { name: "Accent color" });
    await user.clear(input);
    await user.type(input, "#ABCDEF");
    expect(screen.getByRole("status")).toHaveTextContent("#abcdef");
    expect(input).toHaveValue("#ABCDEF");

    await user.tab();
    expect(input).toHaveValue("#abcdef");
  });

  it("returns to the current value when an incomplete draft loses focus", async () => {
    const user = userEvent.setup();
    render(<ControlledColorField />);

    const input = screen.getByRole("textbox", { name: "Accent color" });
    await user.clear(input);
    await user.type(input, "#12");
    await user.tab();

    expect(input).toHaveValue("#1d4ed8");
    expect(screen.getByRole("status")).toHaveTextContent("#1d4ed8");
  });

  it("reports colors chosen with the picker", () => {
    render(<ControlledColorField />);

    fireEvent.change(screen.getByLabelText("Accent color Pick color"), {
      target: { value: "#ff8800" },
    });

    expect(screen.getByRole("status")).toHaveTextContent("#ff8800");
    expect(screen.getByRole("textbox", { name: "Accent color" })).toHaveValue("#ff8800");
  });

  it("follows value changes from the parent", () => {
    const { rerender } = render(
      <ColorField label="Accent color" value="#1d4ed8" onChange={() => {}} />,
    );

    rerender(<ColorField label="Accent color" value="#15803d" onChange={() => {}} />);

    expect(screen.getByRole("textbox", { name: "Accent color" })).toHaveValue("#15803d");
    expect(screen.getByLabelText("Accent color Pick color")).toHaveValue("#15803d");
  });

  it("accepts a replacement picker label and a description", () => {
    render(
      <ColorField
        label="Akzentfarbe"
        pickerLabel="Farbe wählen"
        description="Wirkt auf Schaltflächen."
        value="#1d4ed8"
        onChange={() => {}}
      />,
    );

    const picker = screen.getByLabelText("Akzentfarbe Farbe wählen");
    expect(picker).toHaveAccessibleDescription("Wirkt auf Schaltflächen.");
    expect(screen.getByRole("textbox", { name: "Akzentfarbe" })).toHaveAccessibleDescription(
      "Wirkt auf Schaltflächen.",
    );
  });

  it("works uncontrolled from defaultValue and keeps the picker in sync", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <ColorField
        label="Brand color"
        name="brandColor"
        defaultValue="#15803d"
        onChange={onChange}
      />,
    );

    const input = screen.getByRole("textbox", { name: "Brand color" });
    const picker = screen.getByLabelText("Brand color Pick color");
    expect(input).toHaveAttribute("name", "brandColor");
    expect(picker).toHaveValue("#15803d");

    await user.clear(input);
    await user.type(input, "#ABCDEF");
    expect(picker).toHaveValue("#abcdef");
    expect(onChange).toHaveBeenLastCalledWith("#abcdef");

    await user.clear(input);
    await user.type(input, "#12");
    await user.tab();
    expect(input).toHaveValue("#abcdef");
  });

  it("disables both inputs", () => {
    render(<ColorField label="Accent color" value="#1d4ed8" onChange={() => {}} disabled />);

    expect(screen.getByRole("textbox", { name: "Accent color" })).toBeDisabled();
    expect(screen.getByLabelText("Accent color Pick color")).toBeDisabled();
  });
});

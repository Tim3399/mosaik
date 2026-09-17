import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createRef } from "react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.js";

describe("Button", () => {
  it("renders a native button named by its children", () => {
    render(<Button>Save changes</Button>);

    const button = screen.getByRole("button", { name: "Save changes" });
    expect(button.tagName).toBe("BUTTON");
    expect(button).toHaveClass("mosaik-button");
  });

  it("defaults to type=button so it never submits a surrounding form by accident", () => {
    const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault());
    render(
      <form onSubmit={(event) => onSubmit(event.nativeEvent as SubmitEvent)}>
        <Button>Open details</Button>
      </form>,
    );

    const button = screen.getByRole("button", { name: "Open details" });
    expect(button).toHaveAttribute("type", "button");
    button.click();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("allows type=submit when requested", () => {
    render(<Button type="submit">Send</Button>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
  });

  it("uses the secondary variant unless primary is requested", () => {
    render(
      <>
        <Button>Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </>,
    );

    expect(screen.getByRole("button", { name: "Cancel" })).toHaveAttribute(
      "data-variant",
      "secondary",
    );
    expect(screen.getByRole("button", { name: "Confirm" })).toHaveAttribute(
      "data-variant",
      "primary",
    );
  });

  it("calls onClick for keyboard activation", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Download</Button>);

    await user.tab();
    expect(screen.getByRole("button", { name: "Download" })).toHaveFocus();
    await user.keyboard("{Enter}");
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("does not call onClick while disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Delete
      </Button>,
    );

    await user.click(screen.getByRole("button", { name: "Delete" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("keeps its own class when a layout className is added and forwards the ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(
      <Button ref={ref} className="toolbar-end">
        Export
      </Button>,
    );

    const button = screen.getByRole("button", { name: "Export" });
    expect(button).toHaveClass("mosaik-button", "toolbar-end");
    expect(ref.current).toBe(button);
  });
});

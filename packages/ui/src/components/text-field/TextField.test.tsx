import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";
import { TextField } from "./TextField.js";

describe("TextField", () => {
  it("names the input with its visible label", () => {
    render(<TextField label="Project name" />);

    const input = screen.getByRole("textbox", { name: "Project name" });
    expect(input).toHaveAttribute("type", "text");
    expect(input).not.toHaveAttribute("aria-invalid");
    expect(input).not.toHaveAttribute("aria-describedby");
  });

  it("links description and error to the input and marks it invalid", () => {
    render(
      <TextField
        label="Video link"
        description="Paste a YouTube or Instagram link."
        error="This link cannot be downloaded."
      />,
    );

    const input = screen.getByRole("textbox", { name: "Video link" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription(
      "Paste a YouTube or Instagram link. This link cannot be downloaded.",
    );
  });

  it("keeps a consumer-provided id and aria-describedby", () => {
    render(
      <>
        <p id="shared-hint">Used for all exports.</p>
        <TextField id="export-name" label="File name" aria-describedby="shared-hint" />
      </>,
    );

    const input = screen.getByRole("textbox", { name: "File name" });
    expect(input).toHaveAttribute("id", "export-name");
    expect(input).toHaveAccessibleDescription("Used for all exports.");
  });

  it("passes native input props through for controlled use", async () => {
    const user = userEvent.setup();
    function Controlled() {
      const [value, setValue] = useState("");
      return (
        <>
          <TextField
            label="Search"
            name="query"
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
          />
          <output>{value}</output>
        </>
      );
    }
    render(<Controlled />);

    const input = screen.getByRole("searchbox", { name: "Search" });
    expect(input).toHaveAttribute("name", "query");
    await user.type(input, "Größenänderung");
    expect(screen.getByRole("status")).toHaveTextContent("Größenänderung");
  });

  it("does not accept typing while disabled", async () => {
    const user = userEvent.setup();
    render(<TextField label="Owner" disabled defaultValue="Tim" />);

    const input = screen.getByRole("textbox", { name: "Owner" });
    await user.type(input, "x");
    expect(input).toHaveValue("Tim");
  });
});

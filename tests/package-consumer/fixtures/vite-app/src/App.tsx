import { Button, ColorField, TextField } from "@tim3399/mosaik";
import { useState } from "react";

// No data-mosaik-mode on <html>: the default without a scope must render valid light colors.
export function App() {
  const [color, setColor] = useState("#1d4ed8");
  const [clicks, setClicks] = useState(0);

  return (
    <main>
      <h1>Consumer</h1>
      <Button variant="primary">Create project</Button>
      <TextField label="Project name" description="Shown in the navigation." />
      <ColorField label="Brand color" name="brandColor" defaultValue="#15803d" />
      <div data-mosaik-mode="dark">
        <Button variant="primary">Dark scope</Button>
      </div>
      <section>
        <ColorField label="Accent color" value={color} onChange={setColor} />
        <output data-testid="selected-color">{color}</output>
        <Button onClick={() => setClicks((count) => count + 1)}>Count clicks</Button>
        <output data-testid="click-count">{clicks}</output>
      </section>
    </main>
  );
}

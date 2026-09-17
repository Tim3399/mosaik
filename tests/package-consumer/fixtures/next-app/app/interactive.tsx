"use client";

import { Button, ColorField } from "@tim3399/mosaik";
import { useState } from "react";

export function Interactive() {
  const [color, setColor] = useState("#1d4ed8");
  const [clicks, setClicks] = useState(0);

  return (
    <section>
      <ColorField label="Accent color" value={color} onChange={setColor} />
      <output data-testid="selected-color">{color}</output>
      <Button onClick={() => setClicks((count) => count + 1)}>Count clicks</Button>
      <output data-testid="click-count">{clicks}</output>
    </section>
  );
}

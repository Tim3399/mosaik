"use client";

import { Button, ColorField } from "@tim3399/mosaik";
import { useState } from "react";

export function ClientIsland() {
  const [color, setColor] = useState("#1d4ed8");
  const [clicks, setClicks] = useState(0);

  return (
    <>
      <ColorField
        label="Accent color"
        description="Any opaque color in #rrggbb notation."
        value={color}
        onChange={setColor}
      />
      <p>
        Selected color: <output data-testid="selected-color">{color}</output>
      </p>
      <div className="showcase-row">
        <Button onClick={() => setClicks((count) => count + 1)}>Count clicks</Button>
        <output data-testid="click-count">{clicks === 1 ? "1 click" : `${clicks} clicks`}</output>
      </div>
    </>
  );
}

import { Button, ColorField, TextField } from "@tim3399/mosaik";
import { Interactive } from "./interactive";

// A Server Component using the shared components and, without function props, the stateful
// ColorField directly. The latter only works because the package keeps its "use client".
export default function Page() {
  return (
    <main>
      <h1>Consumer</h1>
      <Button variant="primary">Create project</Button>
      <TextField label="Project name" description="Shown in the navigation." />
      <ColorField label="Brand color" name="brandColor" defaultValue="#15803d" />
      <div data-mosaik-mode="dark">
        <Button variant="primary">Dark scope</Button>
      </div>
      <Interactive />
    </main>
  );
}

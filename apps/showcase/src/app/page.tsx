import { Button, ColorField, TextField } from "@tim3399/mosaik";
import { buildInfo } from "../build-info";
import { ClientIsland } from "./client-island";

export default function HomePage() {
  return (
    <main className="showcase-main">
      <header className="showcase-section">
        <h1>mosaik</h1>
        <p>
          First vertical slice: components from the installed package, rendered by a Server
          Component and by a Client Component. The visual design is provisional.
        </p>
      </header>

      <section className="showcase-section" aria-labelledby="server-rendered">
        <h2 id="server-rendered">Server Component</h2>
        <div className="showcase-row">
          <Button variant="primary">Create project</Button>
          <Button>Cancel</Button>
          <Button disabled>Archive</Button>
        </div>
        <TextField
          label="Project name"
          name="projectName"
          description="Shown in the navigation of every tool."
          placeholder="Untitled project"
        />
        <TextField
          label="Download link"
          name="downloadLink"
          defaultValue="www.example.com/video"
          error="Enter a complete link that starts with https://."
        />
        <ColorField
          label="Brand color"
          name="brandColor"
          defaultValue="#15803d"
          description="A Client Component placed directly in this Server Component."
        />
      </section>

      <section className="showcase-section" aria-labelledby="mode-scopes">
        <h2 id="mode-scopes">Mode scopes</h2>
        <p>Each panel sets its own mode with data-mosaik-mode, independent of the page.</p>
        <div className="showcase-row">
          <div className="showcase-scope" data-mosaik-mode="light">
            <Button variant="primary">Light scope</Button>
          </div>
          <div className="showcase-scope" data-mosaik-mode="dark">
            <Button variant="primary">Dark scope</Button>
          </div>
        </div>
      </section>

      <section className="showcase-section" aria-labelledby="client-rendered">
        <h2 id="client-rendered">Client Component</h2>
        <ClientIsland />
      </section>

      <footer className="showcase-meta">
        @tim3399/mosaik {buildInfo.version} · {buildInfo.revision}
        {buildInfo.dirty ? " (dirty)" : ""} · {buildInfo.mode}
      </footer>
    </main>
  );
}

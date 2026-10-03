import { createFileRoute } from "@tanstack/react-router";
import { appDefinitions, getDefaultAppUrls } from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

export const Route = createFileRoute("/shared-smoke")({
  component: SharedSmokeRoute,
});

function SharedSmokeRoute() {
  const appIds = appDefinitions.map((app) => app.id);
  const urls = getDefaultAppUrls("localhost");

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>Shared package smoke test</h1>

      <section>
        <h2>@niteowl/app-config</h2>
        <p>Loaded {appDefinitions.length} app definitions.</p>
        <pre>{JSON.stringify({ appIds, urls }, null, 2)}</pre>
      </section>

      <section>
        <h2>@niteowl/ui</h2>
        <p>
          Navigation icon import loaded:{" "}
          <NiteOwlNavigationIcon icon="layout-dashboard" aria-hidden="true" />
        </p>
      </section>
    </main>
  );
}

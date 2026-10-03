import { createFileRoute } from "@tanstack/react-router";
import {
  appDefinitions,
  appDefinitionsById,
  buildNavigation,
  getDefaultAppUrls,
} from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

export const Route = createFileRoute("/shared-smoke")({
  component: SharedSmokeRoute,
});

function SharedSmokeRoute() {
  const appIds = appDefinitions.map((app) => app.id);
  const smartDevicesApp = appDefinitionsById["smart-devices"];
  const urls = getDefaultAppUrls("localhost");
  const navigation = buildNavigation({
    currentApp: "smart-devices",
    currentPath: "/",
    urls,
    canAccess: () => true,
  });
  const primaryItems = navigation.primary.flatMap((section) => section.items);

  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <h1>{smartDevicesApp.label} shared package smoke test</h1>

      <section>
        <h2>@niteowl/app-config</h2>
        <p>Loaded {appDefinitions.length} app definitions.</p>
        <pre>{JSON.stringify({ appIds, smartDevicesApp, urls }, null, 2)}</pre>
      </section>

      <section>
        <h2>Smart Devices navigation</h2>
        <ul>
          {primaryItems.map((item) => (
            <li key={item.id}>
              <NiteOwlNavigationIcon icon={item.icon} aria-hidden="true" /> {item.label}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

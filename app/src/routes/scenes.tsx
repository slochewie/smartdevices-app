import { createFileRoute, Link } from "@tanstack/react-router";
import { appDefinitionsById } from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];
const PAGE = SMART_DEVICES_APP.pages.find((page) => page.id === "scenes");

export const Route = createFileRoute("/scenes")({ component: ScenesRoute });

function ScenesRoute() {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", background: "#09090b", color: "#fafafa" }}>
      <section style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#a1a1aa", textDecoration: "none" }}>← Smart Devices</Link>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
          <NiteOwlNavigationIcon icon={PAGE?.icon ?? "shield-check"} />
          {PAGE?.label ?? "Scenes"}
        </h1>
        <p style={{ maxWidth: "44rem", color: "#d4d4d8", lineHeight: 1.6 }}>
          Placeholder for saved device states such as lighting looks, open/close presets, and venue operating modes.
        </p>
      </section>
    </main>
  );
}

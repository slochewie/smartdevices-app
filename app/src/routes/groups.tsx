import { createFileRoute, Link } from "@tanstack/react-router";
import { appDefinitionsById } from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];
const PAGE = SMART_DEVICES_APP.pages.find((page) => page.id === "groups");

export const Route = createFileRoute("/groups")({ component: GroupsRoute });

function GroupsRoute() {
  return (
    <main style={{ minHeight: "100vh", padding: "2rem", fontFamily: "system-ui, sans-serif", background: "#09090b", color: "#fafafa" }}>
      <section style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <Link to="/" style={{ color: "#a1a1aa", textDecoration: "none" }}>← Smart Devices</Link>
        <h1 style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginTop: "1rem" }}>
          <NiteOwlNavigationIcon icon={PAGE?.icon ?? "panels-top-left"} />
          {PAGE?.label ?? "Groups"}
        </h1>
        <p style={{ maxWidth: "44rem", color: "#d4d4d8", lineHeight: 1.6 }}>
          Placeholder for Zigbee2MQTT groups and shared controls that can drive multiple devices together.
        </p>
      </section>
    </main>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import {
  appDefinitionsById,
  buildNavigation,
  getDefaultAppUrls,
} from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];

export const Route = createFileRoute("/")({ component: SmartDevicesHome });

function SmartDevicesHome() {
  const urls = getDefaultAppUrls("localhost");
  const navigation = buildNavigation({
    currentApp: "smart-devices",
    currentPath: "/",
    urls,
    canAccess: () => true,
  });
  const primaryItems = navigation.primary.flatMap((section) => section.items);

  return (
    <main style={{
      minHeight: "100vh",
      padding: "2rem",
      fontFamily: "system-ui, sans-serif",
      background: "#09090b",
      color: "#fafafa",
    }}>
      <section style={{ maxWidth: "64rem", margin: "0 auto" }}>
        <p style={{ margin: 0, color: "#a1a1aa", fontSize: "0.95rem" }}>
          NiteOwl.dev
        </p>
        <h1 style={{ margin: "0.35rem 0 0", fontSize: "clamp(2.25rem, 6vw, 4rem)", lineHeight: 1 }}>
          {SMART_DEVICES_APP.label}
        </h1>
        <p style={{ maxWidth: "44rem", marginTop: "1rem", color: "#d4d4d8", fontSize: "1.1rem", lineHeight: 1.6 }}>
          Organization-based dashboards for MQTT-backed lights, switches, plugs,
          Zigbee2MQTT groups, scenes, and future automations.
        </p>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(14rem, 1fr))",
          gap: "1rem",
          marginTop: "2rem",
        }}>
          {primaryItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              style={{
                display: "flex",
                gap: "0.85rem",
                alignItems: "center",
                minHeight: "5.5rem",
                padding: "1rem",
                border: "1px solid #27272a",
                borderRadius: "1rem",
                background: item.active ? "#18181b" : "#111113",
                color: "inherit",
                textDecoration: "none",
              }}
            >
              <span style={{ display: "inline-flex", width: "1.35rem", height: "1.35rem" }}>
                <NiteOwlNavigationIcon icon={item.icon} />
              </span>
              <span>
                <strong style={{ display: "block" }}>{item.label}</strong>
                <span style={{ color: "#a1a1aa", fontSize: "0.9rem" }}>{item.href}</span>
              </span>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

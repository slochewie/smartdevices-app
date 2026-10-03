import { createFileRoute, Link } from "@tanstack/react-router";
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
    <section className="hero">
      <div>
        <p className="hero__eyebrow">NiteOwl.dev</p>
        <h2>{SMART_DEVICES_APP.label}</h2>
        <p className="hero__description">
          Organization-based dashboards for MQTT-backed lights, switches, plugs,
          Zigbee2MQTT groups, scenes, and future automations.
        </p>
      </div>

      <div className="feature-grid">
        {primaryItems.map((item) => (
          <Link
            key={item.id}
            to={item.href}
            className="feature-card"
            data-active={item.active ? "true" : undefined}
          >
            <NiteOwlNavigationIcon icon={item.icon} />
            <span>
              <strong>{item.label}</strong>
              <span>{item.href}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

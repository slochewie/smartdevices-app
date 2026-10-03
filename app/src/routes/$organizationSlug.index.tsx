import { createFileRoute, Link } from "@tanstack/react-router";
import {
  appDefinitionsById,
  buildNavigation,
  getDefaultAppUrls,
} from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];

export const Route = createFileRoute("/$organizationSlug/")({
  component: OrganizationSmartDevicesHome,
});

function OrganizationSmartDevicesHome() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
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
        <p className="hero__eyebrow">Smart Devices · /{organization.slug}</p>
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
            to={organization.pagePath(item.href)}
            className="feature-card"
            data-active={item.active ? "true" : undefined}
          >
            <NiteOwlNavigationIcon icon={item.icon} />
            <span>
              <strong>{item.label}</strong>
              <span>{organization.pagePath(item.href)}</span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}

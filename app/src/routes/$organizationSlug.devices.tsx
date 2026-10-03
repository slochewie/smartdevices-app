import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";
import { getSmartDevicesSnapshot } from "#/lib/smart-devices-snapshot";

export const Route = createFileRoute("/$organizationSlug/devices")({
  component: DevicesRoute,
});

function DevicesRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
  const snapshot = getSmartDevicesSnapshot(organization.slug);

  return (
    <AppShell organization={organization}>
      <SmartDevicesPage
        organization={organization}
        pageId="devices"
        fallbackLabel="Devices"
        fallbackIcon="plug-zap"
      >
        Smart Devices snapshot data scoped to this organization. The current
        provider is mock-backed and can be swapped for live MQTT discovery later.
      </SmartDevicesPage>

      <section className="data-grid" aria-label="Discovered devices">
        {snapshot.devices.map((device) => (
          <article className="data-card" key={device.id}>
            <div className="data-card__header">
              <div>
                <p className="data-card__eyebrow">{device.room ?? "Unassigned"}</p>
                <h3>{device.friendlyName}</h3>
              </div>
              <span className="status-pill" data-status={device.availability}>
                {device.availability}
              </span>
            </div>

            <dl className="data-list">
              <div>
                <dt>Kind</dt>
                <dd>{device.kind}</dd>
              </div>
              <div>
                <dt>State</dt>
                <dd>{device.state ?? "unknown"}</dd>
              </div>
              <div>
                <dt>Topic</dt>
                <dd>{device.topic}</dd>
              </div>
              <div>
                <dt>Capabilities</dt>
                <dd>{device.capabilities.join(", ")}</dd>
              </div>
              <div>
                <dt>Last seen</dt>
                <dd>{device.lastSeen ?? "unknown"}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>
    </AppShell>
  );
}

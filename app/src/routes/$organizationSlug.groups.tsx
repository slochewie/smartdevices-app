import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";
import { submitSmartDeviceCommand } from "#/lib/smart-devices-command-execution";
import { createGroupCommandIntents } from "#/lib/smart-devices-commands";
import {
  getSmartDeviceMap,
  getSmartDevicesSnapshot,
} from "#/lib/smart-devices-snapshot";
import { formatMqttPayloadPreview } from "#/lib/zigbee2mqtt-publish";

export const Route = createFileRoute("/$organizationSlug/groups")({
  component: GroupsRoute,
});

function GroupsRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
  const snapshot = getSmartDevicesSnapshot(organization.slug);
  const devicesById = getSmartDeviceMap(snapshot);

  return (
    <AppShell organization={organization}>
      <SmartDevicesPage
        organization={organization}
        pageId="groups"
        fallbackLabel="Groups"
        fallbackIcon="panels-top-left"
      >
        Smart Devices group snapshot data scoped to this organization. The
        current provider is mock-backed and can be swapped for live MQTT
        discovery later.
      </SmartDevicesPage>

      <section className="data-grid" aria-label="Discovered groups">
        {snapshot.groups.map((group) => {
          const commandIntents = createGroupCommandIntents(group);

          return (
            <article className="data-card" key={group.id}>
              <div className="data-card__header">
                <div>
                  <p className="data-card__eyebrow">{group.room ?? "Multi-room"}</p>
                  <h3>{group.friendlyName}</h3>
                </div>
                <span className="status-pill" data-status={group.state ?? "unknown"}>
                  {group.state ?? "unknown"}
                </span>
              </div>

              <dl className="data-list">
                <div>
                  <dt>Topic</dt>
                  <dd>{group.topic}</dd>
                </div>
                <div>
                  <dt>Devices</dt>
                  <dd>
                    {group.deviceIds
                      .map((deviceId) => devicesById[deviceId]?.friendlyName ?? deviceId)
                      .join(", ")}
                  </dd>
                </div>
              </dl>

              <div className="command-bar" aria-label={`${group.friendlyName} controls`}>
                {commandIntents.map((intent) => {
                  const result = submitSmartDeviceCommand(intent);

                  return (
                    <button
                      key={intent.id}
                      type="button"
                      className="command-button"
                      disabled={!intent.enabled}
                      title={`${result.message} ${result.publishRequest.topic} ${formatMqttPayloadPreview(
                        result.publishRequest,
                      )}`}
                    >
                      <span>{intent.payload.state === "on" ? "Turn on" : "Turn off"}</span>
                      <code>{formatMqttPayloadPreview(result.publishRequest)}</code>
                      <small>{result.status}</small>
                    </button>
                  );
                })}
              </div>
            </article>
          );
        })}
      </section>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";
import { submitSmartDeviceCommand } from "#/lib/smart-devices-command-execution";
import { createDeviceCommandIntents } from "#/lib/smart-devices-commands";
import {
  getMqttConnectionLabel,
  getSmartDevicesMqttConfig,
} from "#/lib/smart-devices-mqtt-config";
import { getSmartDevicesSnapshot } from "#/lib/smart-devices-snapshot";
import { formatMqttPayloadPreview } from "#/lib/zigbee2mqtt-publish";

export const Route = createFileRoute("/$organizationSlug/devices")({
  component: DevicesRoute,
});

function DevicesRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
  const snapshot = getSmartDevicesSnapshot(organization.slug);
  const mqttConfig = getSmartDevicesMqttConfig(organization.slug);

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

      <section className="config-card" aria-label="MQTT configuration">
        <div>
          <p className="config-card__eyebrow">MQTT config</p>
          <h3>{getMqttConnectionLabel(mqttConfig)}</h3>
          <p>{mqttConfig.statusMessage}</p>
        </div>
        <dl className="config-list">
          <div>
            <dt>Broker</dt>
            <dd>{mqttConfig.brokerUrl || "not configured"}</dd>
          </div>
          <div>
            <dt>Base topic</dt>
            <dd>{mqttConfig.zigbee2MqttBaseTopic}</dd>
          </div>
          <div>
            <dt>Client ID</dt>
            <dd>{mqttConfig.clientId}</dd>
          </div>
        </dl>
      </section>

      <section className="data-grid" aria-label="Discovered devices">
        {snapshot.devices.map((device) => {
          const commandIntents = createDeviceCommandIntents(device);

          return (
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

              <div className="command-bar" aria-label={`${device.friendlyName} controls`}>
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

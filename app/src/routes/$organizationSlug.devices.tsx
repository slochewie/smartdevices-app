import { createFileRoute } from "@tanstack/react-router";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";
import { submitSmartDeviceCommand } from "#/lib/smart-devices-command-execution";
import { createDeviceCommandIntents } from "#/lib/smart-devices-commands";
import {
  getMqttConnectionLabel,
  getSmartDevicesMqttConfig,
} from "#/lib/smart-devices-mqtt-config";
import { getSmartDevicesSnapshot } from "#/lib/smart-devices-snapshot";
import type { SmartDevice, SmartDeviceKind } from "#/lib/smart-devices";
import {
  buildZigbee2MqttTopic,
  formatMqttPayloadPreview,
} from "#/lib/zigbee2mqtt-publish";

type DevicesSearch = {
  room?: string;
  kind?: SmartDeviceKind;
};

const DEVICE_KIND_ORDER: SmartDeviceKind[] = ["light", "plug", "switch", "sensor"];

export const Route = createFileRoute("/$organizationSlug/devices")({
  validateSearch: (search: Record<string, unknown>): DevicesSearch => ({
    room: typeof search.room === "string" && search.room ? search.room : undefined,
    kind:
      typeof search.kind === "string" && DEVICE_KIND_ORDER.includes(search.kind as SmartDeviceKind)
        ? (search.kind as SmartDeviceKind)
        : undefined,
  }),
  component: DevicesRoute,
});

function countDevicesBy<T extends string>(
  devices: SmartDevice[],
  getKey: (device: SmartDevice) => T,
) {
  return devices.reduce<Record<T, number>>(
    (counts, device) => ({
      ...counts,
      [getKey(device)]: (counts[getKey(device)] ?? 0) + 1,
    }),
    {} as Record<T, number>,
  );
}

function getRoomOptions(devices: SmartDevice[]) {
  return [...new Set(devices.map((device) => device.room ?? "Unassigned"))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function getKindOptions(devices: SmartDevice[]) {
  const kinds = new Set(devices.map((device) => device.kind));
  return DEVICE_KIND_ORDER.filter((kind) => kinds.has(kind));
}

function buildDevicesHref({
  organizationSlug,
  room,
  kind,
}: {
  organizationSlug: string;
  room?: string;
  kind?: string;
}) {
  const params = new URLSearchParams();
  if (room) params.set("room", room);
  if (kind) params.set("kind", kind);

  const query = params.toString();
  return `/${organizationSlug}/devices${query ? `?${query}` : ""}`;
}

function formatCapabilityLabel(capability: string) {
  return capability
    .split("-")
    .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
    .join(" ");
}

function DevicesRoute() {
  const { organizationSlug } = Route.useParams();
  const search = Route.useSearch();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
  const snapshot = getSmartDevicesSnapshot(organization.slug);
  const mqttConfig = getSmartDevicesMqttConfig(organization.slug);
  const roomOptions = getRoomOptions(snapshot.devices);
  const kindOptions = getKindOptions(snapshot.devices);
  const roomCounts = countDevicesBy(snapshot.devices, (device) => device.room ?? "Unassigned");
  const kindCounts = countDevicesBy(snapshot.devices, (device) => device.kind);
  const onlineCount = snapshot.devices.filter((device) => device.availability === "online").length;
  const offlineCount = snapshot.devices.filter((device) => device.availability === "offline").length;
  const filteredDevices = snapshot.devices.filter((device) => {
    const room = device.room ?? "Unassigned";
    return (!search.room || room === search.room) && (!search.kind || device.kind === search.kind);
  });

  return (
    <>
      <SmartDevicesPage
        organization={organization}
        pageId="devices"
        fallbackLabel="Devices"
        fallbackIcon="plug-zap"
      >
        Smart Devices snapshot data scoped to this organization. The current
        provider is mock-backed and can be swapped for live MQTT discovery later.
      </SmartDevicesPage>

      <section className="summary-grid" aria-label="Device summary">
        <article className="summary-card">
          <span>Total devices</span>
          <strong>{snapshot.devices.length}</strong>
        </article>
        <article className="summary-card">
          <span>Online</span>
          <strong>{onlineCount}</strong>
        </article>
        <article className="summary-card">
          <span>Offline</span>
          <strong>{offlineCount}</strong>
        </article>
        <article className="summary-card">
          <span>Showing</span>
          <strong>{filteredDevices.length}</strong>
        </article>
      </section>

      <section className="filter-card" aria-label="Device filters">
        <div>
          <p className="filter-card__label">Room</p>
          <div className="filter-pills">
            <a
              className="filter-pill"
              data-active={!search.room ? "true" : undefined}
              href={buildDevicesHref({ organizationSlug: organization.slug, kind: search.kind })}
            >
              All rooms <span>{snapshot.devices.length}</span>
            </a>
            {roomOptions.map((room) => (
              <a
                key={room}
                className="filter-pill"
                data-active={search.room === room ? "true" : undefined}
                href={buildDevicesHref({
                  organizationSlug: organization.slug,
                  room,
                  kind: search.kind,
                })}
              >
                {room} <span>{roomCounts[room]}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="filter-card__label">Type</p>
          <div className="filter-pills">
            <a
              className="filter-pill"
              data-active={!search.kind ? "true" : undefined}
              href={buildDevicesHref({ organizationSlug: organization.slug, room: search.room })}
            >
              All types <span>{snapshot.devices.length}</span>
            </a>
            {kindOptions.map((kind) => (
              <a
                key={kind}
                className="filter-pill"
                data-active={search.kind === kind ? "true" : undefined}
                href={buildDevicesHref({
                  organizationSlug: organization.slug,
                  room: search.room,
                  kind,
                })}
              >
                {kind} <span>{kindCounts[kind]}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

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
        {filteredDevices.map((device) => {
          const commandIntents = createDeviceCommandIntents(device);
          const stateTopic = buildZigbee2MqttTopic(mqttConfig, device.zigbee2MqttEntity)
            .replace(/\/set$/, "");

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
                  <dt>Zigbee2MQTT entity</dt>
                  <dd>{device.zigbee2MqttEntity}</dd>
                </div>
                <div>
                  <dt>State topic</dt>
                  <dd>{stateTopic}</dd>
                </div>
                <div>
                  <dt>Capabilities</dt>
                  <dd>{device.capabilities.map(formatCapabilityLabel).join(", ")}</dd>
                </div>
                <div>
                  <dt>Last seen</dt>
                  <dd>{device.lastSeen ?? "unknown"}</dd>
                </div>
              </dl>

              <div className="command-bar" aria-label={`${device.friendlyName} controls`}>
                {commandIntents.map((intent) => {
                  const result = submitSmartDeviceCommand(intent, mqttConfig);

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
    </>
  );
}

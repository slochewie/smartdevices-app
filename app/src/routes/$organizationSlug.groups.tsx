import { createFileRoute } from "@tanstack/react-router";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";
import { submitSmartDeviceCommand } from "#/lib/smart-devices-command-execution";
import { createGroupCommandIntents } from "#/lib/smart-devices-commands";
import {
  getMqttConnectionLabel,
  getSmartDevicesMqttConfig,
} from "#/lib/smart-devices-mqtt-config";
import {
  getSmartDeviceMap,
  getSmartDevicesSnapshot,
} from "#/lib/smart-devices-snapshot";
import type { SmartDeviceGroup, SmartDeviceGroupState } from "#/lib/smart-devices";
import {
  buildZigbee2MqttTopic,
  formatMqttPayloadPreview,
} from "#/lib/zigbee2mqtt-publish";

type GroupsSearch = {
  room?: string;
  state?: SmartDeviceGroupState;
};

const GROUP_STATE_ORDER: SmartDeviceGroupState[] = ["on", "off", "mixed"];

export const Route = createFileRoute("/$organizationSlug/groups")({
  validateSearch: (search: Record<string, unknown>): GroupsSearch => ({
    room: typeof search.room === "string" && search.room ? search.room : undefined,
    state:
      typeof search.state === "string" && GROUP_STATE_ORDER.includes(search.state as SmartDeviceGroupState)
        ? (search.state as SmartDeviceGroupState)
        : undefined,
  }),
  component: GroupsRoute,
});

function countGroupsBy<T extends string>(
  groups: SmartDeviceGroup[],
  getKey: (group: SmartDeviceGroup) => T,
) {
  return groups.reduce<Record<T, number>>(
    (counts, group) => ({
      ...counts,
      [getKey(group)]: (counts[getKey(group)] ?? 0) + 1,
    }),
    {} as Record<T, number>,
  );
}

function getRoomOptions(groups: SmartDeviceGroup[]) {
  return [...new Set(groups.map((group) => group.room ?? "Multi-room"))].sort((a, b) =>
    a.localeCompare(b),
  );
}

function getStateOptions(groups: SmartDeviceGroup[]) {
  const states = new Set(groups.map((group) => group.state ?? "mixed"));
  return GROUP_STATE_ORDER.filter((state) => states.has(state));
}

function buildGroupsHref({
  organizationSlug,
  room,
  state,
}: {
  organizationSlug: string;
  room?: string;
  state?: string;
}) {
  const params = new URLSearchParams();
  if (room) params.set("room", room);
  if (state) params.set("state", state);

  const query = params.toString();
  return `/${organizationSlug}/groups${query ? `?${query}` : ""}`;
}

function formatGroupState(state?: SmartDeviceGroupState) {
  if (!state) return "Unknown";
  return `${state.charAt(0).toUpperCase()}${state.slice(1)}`;
}

function GroupsRoute() {
  const { organizationSlug } = Route.useParams();
  const search = Route.useSearch();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);
  const snapshot = getSmartDevicesSnapshot(organization.slug);
  const devicesById = getSmartDeviceMap(snapshot);
  const mqttConfig = getSmartDevicesMqttConfig(organization.slug);
  const roomOptions = getRoomOptions(snapshot.groups);
  const stateOptions = getStateOptions(snapshot.groups);
  const roomCounts = countGroupsBy(snapshot.groups, (group) => group.room ?? "Multi-room");
  const stateCounts = countGroupsBy(snapshot.groups, (group) => group.state ?? "mixed");
  const onCount = snapshot.groups.filter((group) => group.state === "on").length;
  const offCount = snapshot.groups.filter((group) => group.state === "off").length;
  const mixedCount = snapshot.groups.filter((group) => group.state === "mixed").length;
  const filteredGroups = snapshot.groups.filter((group) => {
    const room = group.room ?? "Multi-room";
    const state = group.state ?? "mixed";
    return (!search.room || room === search.room) && (!search.state || state === search.state);
  });

  return (
    <>
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

      <section className="summary-grid" aria-label="Group summary">
        <article className="summary-card">
          <span>Total groups</span>
          <strong>{snapshot.groups.length}</strong>
        </article>
        <article className="summary-card">
          <span>On</span>
          <strong>{onCount}</strong>
        </article>
        <article className="summary-card">
          <span>Off</span>
          <strong>{offCount}</strong>
        </article>
        <article className="summary-card">
          <span>Mixed</span>
          <strong>{mixedCount}</strong>
        </article>
        <article className="summary-card">
          <span>Showing</span>
          <strong>{filteredGroups.length}</strong>
        </article>
      </section>

      <section className="filter-card" aria-label="Group filters">
        <div>
          <p className="filter-card__label">Room</p>
          <div className="filter-pills">
            <a
              className="filter-pill"
              data-active={!search.room ? "true" : undefined}
              href={buildGroupsHref({ organizationSlug: organization.slug, state: search.state })}
            >
              All rooms <span>{snapshot.groups.length}</span>
            </a>
            {roomOptions.map((room) => (
              <a
                key={room}
                className="filter-pill"
                data-active={search.room === room ? "true" : undefined}
                href={buildGroupsHref({
                  organizationSlug: organization.slug,
                  room,
                  state: search.state,
                })}
              >
                {room} <span>{roomCounts[room]}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="filter-card__label">State</p>
          <div className="filter-pills">
            <a
              className="filter-pill"
              data-active={!search.state ? "true" : undefined}
              href={buildGroupsHref({ organizationSlug: organization.slug, room: search.room })}
            >
              All states <span>{snapshot.groups.length}</span>
            </a>
            {stateOptions.map((state) => (
              <a
                key={state}
                className="filter-pill"
                data-active={search.state === state ? "true" : undefined}
                href={buildGroupsHref({
                  organizationSlug: organization.slug,
                  room: search.room,
                  state,
                })}
              >
                {state} <span>{stateCounts[state]}</span>
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

      <section className="data-grid" aria-label="Discovered groups">
        {filteredGroups.map((group) => {
          const commandIntents = createGroupCommandIntents(group);
          const stateTopic = buildZigbee2MqttTopic(mqttConfig, group.zigbee2MqttEntity)
            .replace(/\/set$/, "");
          const deviceNames = group.deviceIds.map(
            (deviceId) => devicesById[deviceId]?.friendlyName ?? deviceId,
          );

          return (
            <article className="data-card data-card--compact" key={group.id}>
              <div className="data-card__header">
                <div>
                  <p className="data-card__eyebrow">{group.room ?? "Multi-room"}</p>
                  <h3>{group.friendlyName}</h3>
                </div>
                <span className="status-pill" data-status={group.state ?? "unknown"}>
                  {group.state ?? "unknown"}
                </span>
              </div>

              <div className="device-card__quick">
                <span>{formatGroupState(group.state)}</span>
                <span>{deviceNames.length} devices</span>
              </div>

              <details className="mqtt-details">
                <summary>Group details</summary>
                <dl className="data-list">
                  <div>
                    <dt>Zigbee2MQTT entity</dt>
                    <dd>{group.zigbee2MqttEntity}</dd>
                  </div>
                  <div>
                    <dt>State topic</dt>
                    <dd>{stateTopic}</dd>
                  </div>
                  <div>
                    <dt>Devices</dt>
                    <dd>{deviceNames.join(", ")}</dd>
                  </div>
                </dl>
              </details>

              <div className="command-bar" aria-label={`${group.friendlyName} controls`}>
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

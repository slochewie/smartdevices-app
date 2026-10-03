import type {
  SmartDevice,
  SmartDeviceAvailability,
  SmartDeviceCapability,
  SmartDeviceGroup,
  SmartDeviceKind,
  SmartDevicePowerState,
  Zigbee2MqttDeviceDefinition,
  Zigbee2MqttDeviceState,
  Zigbee2MqttGroupDefinition,
} from "./smart-devices";

function toStableId(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toFriendlyName(entity: string) {
  return entity
    .split(/[_\s-]+/g)
    .filter(Boolean)
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}

function collectExposeProperties(exposes: Zigbee2MqttDeviceDefinition["definition"]["exposes"] = []) {
  const properties = new Set<string>();

  for (const expose of exposes) {
    if (expose.property) properties.add(expose.property);
    if (expose.name) properties.add(expose.name);
    for (const feature of expose.features ?? []) {
      if (feature.property) properties.add(feature.property);
      if (feature.name) properties.add(feature.name);
    }
  }

  return properties;
}

function detectCapabilities(definition: Zigbee2MqttDeviceDefinition): SmartDeviceCapability[] {
  const properties = collectExposeProperties(definition.definition.exposes);
  const capabilities = new Set<SmartDeviceCapability>();

  if (properties.has("state")) capabilities.add("power");
  if (properties.has("brightness")) capabilities.add("brightness");
  if (properties.has("color_temp") || properties.has("color_temperature")) {
    capabilities.add("color-temperature");
  }
  if (properties.has("occupancy")) capabilities.add("occupancy");
  if (properties.has("temperature")) capabilities.add("temperature");

  return [...capabilities];
}

function detectKind(
  definition: Zigbee2MqttDeviceDefinition,
  capabilities: SmartDeviceCapability[],
): SmartDeviceKind {
  const entityName = definition.friendly_name.toLowerCase();
  const description = `${definition.definition.model ?? ""} ${definition.definition.description ?? ""}`.toLowerCase();

  if (capabilities.includes("occupancy") || capabilities.includes("temperature")) return "sensor";
  if (capabilities.includes("brightness") || capabilities.includes("color-temperature")) return "light";
  if (entityName.includes("plug") || description.includes("plug")) return "plug";
  return "switch";
}

function normalizeAvailability(state?: Zigbee2MqttDeviceState): SmartDeviceAvailability {
  if (!state?.availability) return "unknown";
  if (state.availability === "online" || state.availability === "offline") return state.availability;
  return "unknown";
}

function normalizePowerState(state?: Zigbee2MqttDeviceState): SmartDevicePowerState | undefined {
  if (state?.state === "ON") return "on";
  if (state?.state === "OFF") return "off";
  return undefined;
}

export function parseZigbee2MqttDeviceDefinition({
  organizationSlug,
  definition,
  state,
}: {
  organizationSlug: string;
  definition: Zigbee2MqttDeviceDefinition;
  state?: Zigbee2MqttDeviceState;
}): SmartDevice {
  const capabilities = detectCapabilities(definition);

  return {
    id: toStableId(definition.friendly_name),
    organizationSlug,
    friendlyName: toFriendlyName(definition.friendly_name),
    kind: detectKind(definition, capabilities),
    zigbee2MqttEntity: definition.friendly_name,
    availability: normalizeAvailability(state),
    room: state?.room,
    state: normalizePowerState(state),
    capabilities,
    lastSeen: state?.lastSeen,
  };
}

export function parseZigbee2MqttGroupDefinition({
  organizationSlug,
  definition,
  deviceByEntity,
  state,
}: {
  organizationSlug: string;
  definition: Zigbee2MqttGroupDefinition;
  deviceByEntity: Record<string, SmartDevice>;
  state?: Zigbee2MqttDeviceState;
}): SmartDeviceGroup {
  return {
    id: toStableId(definition.friendly_name),
    organizationSlug,
    friendlyName: toFriendlyName(definition.friendly_name),
    zigbee2MqttEntity: definition.friendly_name,
    deviceIds: (definition.members ?? [])
      .map((member) => member.friendly_name)
      .filter((entity): entity is string => Boolean(entity))
      .map((entity) => deviceByEntity[entity]?.id ?? toStableId(entity)),
    room: state?.room,
    state: normalizePowerState(state) ?? "mixed",
  };
}

export function parseZigbee2MqttDiscovery({
  organizationSlug,
  devices,
  groups,
  states = {},
}: {
  organizationSlug: string;
  devices: Zigbee2MqttDeviceDefinition[];
  groups: Zigbee2MqttGroupDefinition[];
  states?: Record<string, Zigbee2MqttDeviceState>;
}) {
  const parsedDevices = devices.map((definition) =>
    parseZigbee2MqttDeviceDefinition({
      organizationSlug,
      definition,
      state: states[definition.friendly_name],
    }),
  );
  const deviceByEntity = Object.fromEntries(
    parsedDevices.map((device) => [device.zigbee2MqttEntity, device]),
  );

  return {
    devices: parsedDevices,
    groups: groups.map((definition) =>
      parseZigbee2MqttGroupDefinition({
        organizationSlug,
        definition,
        deviceByEntity,
        state: states[definition.friendly_name],
      }),
    ),
  };
}

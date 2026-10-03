import type {
  SmartDevicesRetainedMqttMessage,
  SmartDevicesRetainedMqttSnapshot,
  Zigbee2MqttDeviceDefinition,
  Zigbee2MqttDeviceState,
  Zigbee2MqttGroupDefinition,
} from "./smart-devices";

type RetainedSnapshotInput = {
  organizationSlug: string;
  baseTopic: string;
  devices: Zigbee2MqttDeviceDefinition[];
  groups: Zigbee2MqttGroupDefinition[];
  states?: Record<string, Zigbee2MqttDeviceState>;
  capturedAt?: string;
};

function normalizeTopicSegment(segment: string) {
  return segment.trim().replace(/^\/+|\/+$/g, "");
}

function createRetainedMessage({
  topic,
  payload,
  capturedAt,
}: {
  topic: string;
  payload: unknown;
  capturedAt: string;
}): SmartDevicesRetainedMqttMessage {
  return {
    topic,
    payload,
    retain: true,
    capturedAt,
  };
}

export function createZigbee2MqttRetainedSnapshot({
  organizationSlug,
  baseTopic,
  devices,
  groups,
  states = {},
  capturedAt = new Date().toISOString(),
}: RetainedSnapshotInput): SmartDevicesRetainedMqttSnapshot {
  const normalizedBaseTopic = normalizeTopicSegment(baseTopic);
  const messages: SmartDevicesRetainedMqttMessage[] = [
    createRetainedMessage({
      topic: `${normalizedBaseTopic}/bridge/devices`,
      payload: devices,
      capturedAt,
    }),
    createRetainedMessage({
      topic: `${normalizedBaseTopic}/bridge/groups`,
      payload: groups,
      capturedAt,
    }),
  ];

  for (const [entity, state] of Object.entries(states)) {
    messages.push(
      createRetainedMessage({
        topic: `${normalizedBaseTopic}/${normalizeTopicSegment(entity)}`,
        payload: state,
        capturedAt,
      }),
    );
  }

  return {
    organizationSlug,
    baseTopic: normalizedBaseTopic,
    messages,
    capturedAt,
  };
}

export function getRetainedJsonPayload<T>(message: SmartDevicesRetainedMqttMessage): T | undefined {
  if (typeof message.payload === "string") {
    try {
      return JSON.parse(message.payload) as T;
    } catch {
      return undefined;
    }
  }

  return message.payload as T;
}

export function findRetainedMessage(
  snapshot: SmartDevicesRetainedMqttSnapshot,
  topic: string,
) {
  return snapshot.messages.find((message) => message.topic === topic);
}

export function getRetainedEntityName(
  snapshot: SmartDevicesRetainedMqttSnapshot,
  topic: string,
) {
  const prefix = `${snapshot.baseTopic}/`;
  if (!topic.startsWith(prefix)) return undefined;

  const entity = topic.slice(prefix.length);
  if (!entity || entity.startsWith("bridge/") || entity.endsWith("/set")) return undefined;

  return entity;
}

export function readZigbee2MqttRetainedDiscovery(snapshot: SmartDevicesRetainedMqttSnapshot) {
  const devicesTopic = `${snapshot.baseTopic}/bridge/devices`;
  const groupsTopic = `${snapshot.baseTopic}/bridge/groups`;
  const devices = getRetainedJsonPayload<Zigbee2MqttDeviceDefinition[]>(
    findRetainedMessage(snapshot, devicesTopic) ?? {
      topic: devicesTopic,
      payload: [],
      retain: true,
      capturedAt: snapshot.capturedAt,
    },
  ) ?? [];
  const groups = getRetainedJsonPayload<Zigbee2MqttGroupDefinition[]>(
    findRetainedMessage(snapshot, groupsTopic) ?? {
      topic: groupsTopic,
      payload: [],
      retain: true,
      capturedAt: snapshot.capturedAt,
    },
  ) ?? [];
  const states: Record<string, Zigbee2MqttDeviceState> = {};

  for (const message of snapshot.messages) {
    const entity = getRetainedEntityName(snapshot, message.topic);
    if (!entity) continue;

    const state = getRetainedJsonPayload<Zigbee2MqttDeviceState>(message);
    if (state) states[entity] = state;
  }

  return { devices, groups, states };
}

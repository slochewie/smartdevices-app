import type {
  SmartDevice,
  SmartDeviceCommandIntent,
  SmartDeviceControlTarget,
  SmartDeviceGroup,
  SmartDevicePowerState,
} from "./smart-devices";

const MQTT_NOT_WIRED_REASON = "MQTT publish is not wired yet.";

type CommandIntentInput = {
  organizationSlug: string;
  targetType: SmartDeviceControlTarget;
  targetId: string;
  topic: string;
  state: SmartDevicePowerState;
};

function createCommandIntent({
  organizationSlug,
  targetType,
  targetId,
  topic,
  state,
}: CommandIntentInput): SmartDeviceCommandIntent {
  return {
    id: `${targetType}:${targetId}:${state}`,
    organizationSlug,
    targetType,
    targetId,
    topic,
    command: state === "on" ? "turn-on" : "turn-off",
    payload: { state },
    enabled: false,
    disabledReason: MQTT_NOT_WIRED_REASON,
  };
}

export function createDeviceCommandIntents(device: SmartDevice) {
  return [
    createCommandIntent({
      organizationSlug: device.organizationSlug,
      targetType: "device",
      targetId: device.id,
      topic: `${device.topic}/set`,
      state: "on",
    }),
    createCommandIntent({
      organizationSlug: device.organizationSlug,
      targetType: "device",
      targetId: device.id,
      topic: `${device.topic}/set`,
      state: "off",
    }),
  ];
}

export function createGroupCommandIntents(group: SmartDeviceGroup) {
  return [
    createCommandIntent({
      organizationSlug: group.organizationSlug,
      targetType: "group",
      targetId: group.id,
      topic: `${group.topic}/set`,
      state: "on",
    }),
    createCommandIntent({
      organizationSlug: group.organizationSlug,
      targetType: "group",
      targetId: group.id,
      topic: `${group.topic}/set`,
      state: "off",
    }),
  ];
}

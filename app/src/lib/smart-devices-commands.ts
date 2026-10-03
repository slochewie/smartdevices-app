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
  zigbee2MqttEntity: string;
  state: SmartDevicePowerState;
};

function createCommandIntent({
  organizationSlug,
  targetType,
  targetId,
  zigbee2MqttEntity,
  state,
}: CommandIntentInput): SmartDeviceCommandIntent {
  return {
    id: `${targetType}:${targetId}:${state}`,
    organizationSlug,
    targetType,
    targetId,
    zigbee2MqttEntity,
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
      zigbee2MqttEntity: device.zigbee2MqttEntity,
      state: "on",
    }),
    createCommandIntent({
      organizationSlug: device.organizationSlug,
      targetType: "device",
      targetId: device.id,
      zigbee2MqttEntity: device.zigbee2MqttEntity,
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
      zigbee2MqttEntity: group.zigbee2MqttEntity,
      state: "on",
    }),
    createCommandIntent({
      organizationSlug: group.organizationSlug,
      targetType: "group",
      targetId: group.id,
      zigbee2MqttEntity: group.zigbee2MqttEntity,
      state: "off",
    }),
  ];
}

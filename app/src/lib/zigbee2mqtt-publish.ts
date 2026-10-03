import type {
  SmartDeviceCommandIntent,
  SmartDeviceMqttPublishRequest,
  SmartDevicesMqttConfig,
} from "./smart-devices";

export function buildZigbee2MqttTopic(
  config: SmartDevicesMqttConfig,
  entity: string,
) {
  return [config.zigbee2MqttBaseTopic, entity, "set"]
    .map((part) => part.trim().replace(/^\/+|\/+$/g, ""))
    .filter(Boolean)
    .join("/");
}

export function createZigbee2MqttPublishRequest(
  intent: SmartDeviceCommandIntent,
  config: SmartDevicesMqttConfig,
): SmartDeviceMqttPublishRequest {
  return {
    organizationSlug: intent.organizationSlug,
    targetType: intent.targetType,
    targetId: intent.targetId,
    topic: buildZigbee2MqttTopic(config, intent.zigbee2MqttEntity),
    payload: {
      state: intent.payload.state.toUpperCase() as "ON" | "OFF",
    },
    qos: 0,
    retain: false,
  };
}

export function formatMqttPayloadPreview(request: SmartDeviceMqttPublishRequest) {
  return JSON.stringify(request.payload);
}

import type { SmartDeviceCommandIntent, SmartDeviceMqttPublishRequest } from "./smart-devices";

export function createZigbee2MqttPublishRequest(
  intent: SmartDeviceCommandIntent,
): SmartDeviceMqttPublishRequest {
  return {
    organizationSlug: intent.organizationSlug,
    targetType: intent.targetType,
    targetId: intent.targetId,
    topic: intent.topic,
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

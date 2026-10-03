import type {
  SmartDeviceCommandExecutionResult,
  SmartDeviceCommandIntent,
} from "./smart-devices";
import { createZigbee2MqttPublishRequest } from "./zigbee2mqtt-publish";

const MQTT_NOT_WIRED_MESSAGE = "MQTT publisher is not wired yet.";

export function submitSmartDeviceCommand(
  intent: SmartDeviceCommandIntent,
): SmartDeviceCommandExecutionResult {
  const publishRequest = createZigbee2MqttPublishRequest(intent);

  return {
    id: `dry-run:${intent.id}`,
    organizationSlug: intent.organizationSlug,
    intent,
    publishRequest,
    status: "not-wired",
    message: MQTT_NOT_WIRED_MESSAGE,
  };
}

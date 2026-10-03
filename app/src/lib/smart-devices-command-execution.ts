import type {
  SmartDeviceCommandExecutionResult,
  SmartDeviceCommandExecutionStatus,
  SmartDeviceCommandIntent,
  SmartDevicesMqttConfig,
  SmartDevicesMqttPublishStatus,
} from "./smart-devices";
import { publishSmartDevicesMqttRequest } from "./smart-devices-mqtt-publisher";
import { createZigbee2MqttPublishRequest } from "./zigbee2mqtt-publish";

function mapPublishStatusToCommandStatus(
  status: SmartDevicesMqttPublishStatus,
): SmartDeviceCommandExecutionStatus {
  switch (status) {
    case "dry-run":
      return "dry-run";
    case "queued":
      return "queued";
    case "sent":
      return "sent";
    case "failed":
      return "failed";
    case "not-configured":
    case "not-wired":
      return "not-wired";
  }
}

export function submitSmartDeviceCommand(
  intent: SmartDeviceCommandIntent,
  mqttConfig: SmartDevicesMqttConfig,
): SmartDeviceCommandExecutionResult {
  const publishRequest = createZigbee2MqttPublishRequest(intent, mqttConfig);
  const publishResult = publishSmartDevicesMqttRequest({
    config: mqttConfig,
    request: publishRequest,
  });

  return {
    id: `command:${publishResult.id}`,
    organizationSlug: intent.organizationSlug,
    intent,
    publishRequest,
    publishResult,
    status: mapPublishStatusToCommandStatus(publishResult.status),
    message: publishResult.message,
  };
}

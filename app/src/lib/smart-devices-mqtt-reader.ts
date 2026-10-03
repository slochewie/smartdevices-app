import { getMockRetainedMqttSnapshot } from "./mock-smart-devices";
import type {
  SmartDevicesMqttConfig,
  SmartDevicesRetainedMqttReadResult,
} from "./smart-devices";
import { createZigbee2MqttRetainedSnapshot } from "./zigbee2mqtt-retained-messages";

const MOCK_READER_MESSAGE =
  "Using mock retained MQTT messages. Live broker retained-message reads are not wired yet.";

const NOT_CONFIGURED_MESSAGE =
  "MQTT config is missing, so retained messages cannot be read from a broker yet.";

export function readSmartDevicesRetainedMqttSnapshot(
  config: SmartDevicesMqttConfig,
): SmartDevicesRetainedMqttReadResult {
  if (!config.brokerUrl) {
    return {
      organizationSlug: config.organizationSlug,
      status: "not-configured",
      message: NOT_CONFIGURED_MESSAGE,
      snapshot: createZigbee2MqttRetainedSnapshot({
        organizationSlug: config.organizationSlug,
        baseTopic: config.zigbee2MqttBaseTopic,
        devices: [],
        groups: [],
        capturedAt: new Date().toISOString(),
      }),
    };
  }

  return {
    organizationSlug: config.organizationSlug,
    status: "mock",
    message: MOCK_READER_MESSAGE,
    snapshot: getMockRetainedMqttSnapshot(config.organizationSlug, config.zigbee2MqttBaseTopic),
  };
}

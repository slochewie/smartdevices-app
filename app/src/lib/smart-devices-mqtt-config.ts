import type { SmartDevicesMqttConfig } from "./smart-devices";

const DEFAULT_BASE_TOPIC = "zigbee2mqtt";

const mockMqttConfigs: Record<string, SmartDevicesMqttConfig> = {
  "mccarthys-irish-pub": {
    organizationSlug: "mccarthys-irish-pub",
    brokerUrl: "mqtt://mosquitto:1883",
    zigbee2MqttBaseTopic: DEFAULT_BASE_TOPIC,
    clientId: "smartdevices-app-mccarthys-irish-pub",
    status: "configured",
    statusMessage: "MQTT config is present. Live broker connection is not wired yet.",
    lastCheckedAt: "not checked",
  },
};

export function getSmartDevicesMqttConfig(
  organizationSlug: string,
): SmartDevicesMqttConfig {
  return (
    mockMqttConfigs[organizationSlug] ?? {
      organizationSlug,
      brokerUrl: "",
      zigbee2MqttBaseTopic: DEFAULT_BASE_TOPIC,
      clientId: `smartdevices-app-${organizationSlug}`,
      status: "not-configured",
      statusMessage: "MQTT config has not been created for this organization yet.",
      lastCheckedAt: "not checked",
    }
  );
}

export function getMqttConnectionLabel(config: SmartDevicesMqttConfig) {
  switch (config.status) {
    case "connected":
      return "MQTT connected";
    case "connecting":
      return "MQTT connecting";
    case "configured":
      return "MQTT configured";
    case "disconnected":
      return "MQTT disconnected";
    case "error":
      return "MQTT error";
    case "not-configured":
      return "MQTT not configured";
  }
}

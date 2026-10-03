import { getSmartDevicesMqttConfig } from "./smart-devices-mqtt-config";
import { readSmartDevicesRetainedMqttSnapshot } from "./smart-devices-mqtt-reader";
import type { SmartDevicesSnapshot } from "./smart-devices";
import { parseZigbee2MqttRetainedSnapshot } from "./zigbee2mqtt-discovery";

export function getSmartDevicesSnapshot(organizationSlug: string): SmartDevicesSnapshot {
  const mqttConfig = getSmartDevicesMqttConfig(organizationSlug);
  const readResult = readSmartDevicesRetainedMqttSnapshot(mqttConfig);
  const discovery = parseZigbee2MqttRetainedSnapshot(readResult.snapshot);

  return {
    organizationSlug,
    source: readResult.status === "mock" ? "mock" : "mqtt",
    devices: discovery.devices,
    groups: discovery.groups,
    capturedAt: readResult.snapshot.capturedAt,
  };
}

export function getSmartDeviceMap(snapshot: SmartDevicesSnapshot) {
  return Object.fromEntries(
    snapshot.devices.map((device) => [device.id, device]),
  );
}

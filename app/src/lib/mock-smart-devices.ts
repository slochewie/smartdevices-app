import {
  mccarthysDeviceDefinitions,
  mccarthysEntityStates,
  mccarthysGroupDefinitions,
} from "./mccarthys-zigbee2mqtt-fixtures";
import { parseZigbee2MqttRetainedSnapshot } from "./zigbee2mqtt-discovery";
import { createZigbee2MqttRetainedSnapshot } from "./zigbee2mqtt-retained-messages";

const MOCK_BASE_TOPIC = "zigbee2mqtt";
const MOCK_ORGANIZATION_SLUG = "mccarthys-irish-pub";

export function getMockRetainedMqttSnapshot(
  organizationSlug: string,
  baseTopic = MOCK_BASE_TOPIC,
) {
  return createZigbee2MqttRetainedSnapshot({
    organizationSlug,
    baseTopic,
    devices: organizationSlug === MOCK_ORGANIZATION_SLUG ? mccarthysDeviceDefinitions : [],
    groups: organizationSlug === MOCK_ORGANIZATION_SLUG ? mccarthysGroupDefinitions : [],
    states: organizationSlug === MOCK_ORGANIZATION_SLUG ? mccarthysEntityStates : {},
  });
}

function getMockDiscovery(organizationSlug: string) {
  return parseZigbee2MqttRetainedSnapshot(getMockRetainedMqttSnapshot(organizationSlug));
}

export function getMockSmartDevices(organizationSlug: string) {
  return getMockDiscovery(organizationSlug).devices;
}

export function getMockSmartDeviceGroups(organizationSlug: string) {
  return getMockDiscovery(organizationSlug).groups;
}

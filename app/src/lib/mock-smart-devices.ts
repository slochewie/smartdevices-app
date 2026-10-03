import type {
  Zigbee2MqttDeviceDefinition,
  Zigbee2MqttDeviceState,
  Zigbee2MqttGroupDefinition,
} from "./smart-devices";
import { parseZigbee2MqttRetainedSnapshot } from "./zigbee2mqtt-discovery";
import { createZigbee2MqttRetainedSnapshot } from "./zigbee2mqtt-retained-messages";

const MOCK_BASE_TOPIC = "zigbee2mqtt";
const MOCK_ORGANIZATION_SLUG = "mccarthys-irish-pub";

const mockDeviceDefinitions: Zigbee2MqttDeviceDefinition[] = [
  {
    ieee_address: "0x0017880100010001",
    friendly_name: "bar_pendants",
    definition: {
      vendor: "Philips",
      model: "dimmable-light",
      description: "Bar pendant bulbs",
      exposes: [
        { type: "binary", name: "state", property: "state" },
        { type: "numeric", name: "brightness", property: "brightness" },
        { type: "numeric", name: "color_temp", property: "color_temp" },
      ],
    },
    interview_completed: true,
  },
  {
    ieee_address: "0x0017880100010002",
    friendly_name: "backbar_leds",
    definition: {
      vendor: "Gledopto",
      model: "led-controller",
      description: "Backbar LED controller",
      exposes: [
        { type: "binary", name: "state", property: "state" },
        { type: "numeric", name: "brightness", property: "brightness" },
      ],
    },
    interview_completed: true,
  },
  {
    ieee_address: "0x00158d0000010003",
    friendly_name: "patio_string_lights",
    definition: {
      vendor: "SONOFF",
      model: "switch",
      description: "Outdoor relay switch",
      exposes: [{ type: "binary", name: "state", property: "state" }],
    },
    interview_completed: true,
  },
  {
    ieee_address: "0x00124b0024010004",
    friendly_name: "christmas_tree_plug",
    definition: {
      vendor: "Third Reality",
      model: "smart-plug",
      description: "Smart plug",
      exposes: [{ type: "binary", name: "state", property: "state" }],
    },
    interview_completed: true,
  },
];

const mockGroupDefinitions: Zigbee2MqttGroupDefinition[] = [
  {
    id: 1,
    friendly_name: "bar_lights",
    members: [
      { friendly_name: "bar_pendants", ieee_address: "0x0017880100010001" },
      { friendly_name: "backbar_leds", ieee_address: "0x0017880100010002" },
    ],
  },
  {
    id: 2,
    friendly_name: "open_lights",
    members: [
      { friendly_name: "bar_pendants", ieee_address: "0x0017880100010001" },
      { friendly_name: "backbar_leds", ieee_address: "0x0017880100010002" },
      { friendly_name: "patio_string_lights", ieee_address: "0x00158d0000010003" },
    ],
  },
];

const mockEntityStates: Record<string, Zigbee2MqttDeviceState> = {
  bar_pendants: {
    availability: "online",
    state: "ON",
    room: "Bar",
    lastSeen: "2 minutes ago",
  },
  backbar_leds: {
    availability: "online",
    state: "ON",
    room: "Bar",
    lastSeen: "1 minute ago",
  },
  patio_string_lights: {
    availability: "offline",
    state: "OFF",
    room: "Patio",
    lastSeen: "47 minutes ago",
  },
  christmas_tree_plug: {
    availability: "online",
    state: "OFF",
    room: "Dining Room",
    lastSeen: "5 minutes ago",
  },
  bar_lights: {
    state: "ON",
    room: "Bar",
  },
};

export function getMockRetainedMqttSnapshot(
  organizationSlug: string,
  baseTopic = MOCK_BASE_TOPIC,
) {
  return createZigbee2MqttRetainedSnapshot({
    organizationSlug,
    baseTopic,
    devices: organizationSlug === MOCK_ORGANIZATION_SLUG ? mockDeviceDefinitions : [],
    groups: organizationSlug === MOCK_ORGANIZATION_SLUG ? mockGroupDefinitions : [],
    states: organizationSlug === MOCK_ORGANIZATION_SLUG ? mockEntityStates : {},
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

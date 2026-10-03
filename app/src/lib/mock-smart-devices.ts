import type { SmartDevice, SmartDeviceGroup } from "./smart-devices";

const mockDevices: SmartDevice[] = [
  {
    id: "bar-pendants",
    organizationSlug: "mccarthys-irish-pub",
    friendlyName: "Bar Pendants",
    kind: "light",
    zigbee2MqttEntity: "bar_pendants",
    availability: "online",
    room: "Bar",
    state: "on",
    capabilities: ["power", "brightness", "color-temperature"],
    lastSeen: "2 minutes ago",
  },
  {
    id: "backbar-leds",
    organizationSlug: "mccarthys-irish-pub",
    friendlyName: "Backbar LEDs",
    kind: "light",
    zigbee2MqttEntity: "backbar_leds",
    availability: "online",
    room: "Bar",
    state: "on",
    capabilities: ["power", "brightness"],
    lastSeen: "1 minute ago",
  },
  {
    id: "patio-string-lights",
    organizationSlug: "mccarthys-irish-pub",
    friendlyName: "Patio String Lights",
    kind: "switch",
    zigbee2MqttEntity: "patio_string_lights",
    availability: "offline",
    room: "Patio",
    state: "off",
    capabilities: ["power"],
    lastSeen: "47 minutes ago",
  },
  {
    id: "christmas-tree-plug",
    organizationSlug: "mccarthys-irish-pub",
    friendlyName: "Christmas Tree Plug",
    kind: "plug",
    zigbee2MqttEntity: "christmas_tree_plug",
    availability: "online",
    room: "Dining Room",
    state: "off",
    capabilities: ["power"],
    lastSeen: "5 minutes ago",
  },
];

const mockGroups: SmartDeviceGroup[] = [
  {
    id: "bar-lights",
    organizationSlug: "mccarthys-irish-pub",
    friendlyName: "Bar Lights",
    zigbee2MqttEntity: "bar_lights",
    deviceIds: ["bar-pendants", "backbar-leds"],
    room: "Bar",
    state: "on",
  },
  {
    id: "open-lights",
    organizationSlug: "mccarthys-irish-pub",
    friendlyName: "Open Lights",
    zigbee2MqttEntity: "open_lights",
    deviceIds: ["bar-pendants", "backbar-leds", "patio-string-lights"],
    state: "mixed",
  },
];

export function getMockSmartDevices(organizationSlug: string) {
  return mockDevices.filter((device) => device.organizationSlug === organizationSlug);
}

export function getMockSmartDeviceGroups(organizationSlug: string) {
  return mockGroups.filter((group) => group.organizationSlug === organizationSlug);
}

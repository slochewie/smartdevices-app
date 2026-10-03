export type SmartDeviceKind = "light" | "switch" | "plug" | "sensor";

export type SmartDeviceAvailability = "online" | "offline" | "unknown";

export type SmartDeviceCapability =
  | "power"
  | "brightness"
  | "color-temperature"
  | "occupancy"
  | "temperature";

export type SmartDevice = {
  id: string;
  organizationSlug: string;
  friendlyName: string;
  kind: SmartDeviceKind;
  topic: string;
  availability: SmartDeviceAvailability;
  room?: string;
  state?: "on" | "off";
  capabilities: SmartDeviceCapability[];
  lastSeen?: string;
};

export type SmartDeviceGroup = {
  id: string;
  organizationSlug: string;
  friendlyName: string;
  topic: string;
  deviceIds: string[];
  room?: string;
  state?: "on" | "off" | "mixed";
};

export type SmartDevicesSnapshot = {
  organizationSlug: string;
  source: "mock" | "mqtt";
  devices: SmartDevice[];
  groups: SmartDeviceGroup[];
  capturedAt: string;
};

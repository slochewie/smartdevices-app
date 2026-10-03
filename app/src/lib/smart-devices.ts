export type SmartDeviceKind = "light" | "switch" | "plug" | "sensor";

export type SmartDeviceAvailability = "online" | "offline" | "unknown";

export type SmartDeviceCapability =
  | "power"
  | "brightness"
  | "color-temperature"
  | "occupancy"
  | "temperature";

export type SmartDevicePowerState = "on" | "off";

export type SmartDeviceGroupState = SmartDevicePowerState | "mixed";

export type SmartDeviceControlTarget = "device" | "group";

export type SmartDeviceCommandIntent = {
  id: string;
  organizationSlug: string;
  targetType: SmartDeviceControlTarget;
  targetId: string;
  topic: string;
  command: "turn-on" | "turn-off";
  payload: {
    state: SmartDevicePowerState;
  };
  enabled: boolean;
  disabledReason?: string;
};

export type SmartDevice = {
  id: string;
  organizationSlug: string;
  friendlyName: string;
  kind: SmartDeviceKind;
  topic: string;
  availability: SmartDeviceAvailability;
  room?: string;
  state?: SmartDevicePowerState;
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
  state?: SmartDeviceGroupState;
};

export type SmartDevicesSnapshot = {
  organizationSlug: string;
  source: "mock" | "mqtt";
  devices: SmartDevice[];
  groups: SmartDeviceGroup[];
  capturedAt: string;
};

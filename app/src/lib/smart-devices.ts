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

export type SmartDevicesMqttConnectionStatus =
  | "not-configured"
  | "configured"
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export type SmartDevicesMqttConfig = {
  organizationSlug: string;
  brokerUrl: string;
  zigbee2MqttBaseTopic: string;
  clientId: string;
  status: SmartDevicesMqttConnectionStatus;
  statusMessage: string;
  lastCheckedAt?: string;
};

export type SmartDeviceCommandIntent = {
  id: string;
  organizationSlug: string;
  targetType: SmartDeviceControlTarget;
  targetId: string;
  zigbee2MqttEntity: string;
  command: "turn-on" | "turn-off";
  payload: {
    state: SmartDevicePowerState;
  };
  enabled: boolean;
  disabledReason?: string;
};

export type SmartDeviceMqttPublishRequest = {
  organizationSlug: string;
  targetType: SmartDeviceControlTarget;
  targetId: string;
  topic: string;
  payload: {
    state: "ON" | "OFF";
  };
  qos: 0 | 1 | 2;
  retain: boolean;
};

export type SmartDeviceCommandExecutionStatus =
  | "not-wired"
  | "dry-run"
  | "queued"
  | "sent"
  | "failed";

export type SmartDeviceCommandExecutionResult = {
  id: string;
  organizationSlug: string;
  intent: SmartDeviceCommandIntent;
  publishRequest: SmartDeviceMqttPublishRequest;
  status: SmartDeviceCommandExecutionStatus;
  message: string;
};

export type SmartDevice = {
  id: string;
  organizationSlug: string;
  friendlyName: string;
  kind: SmartDeviceKind;
  zigbee2MqttEntity: string;
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
  zigbee2MqttEntity: string;
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

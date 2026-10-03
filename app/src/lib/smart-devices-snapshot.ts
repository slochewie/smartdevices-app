import {
  getMockSmartDeviceGroups,
  getMockSmartDevices,
} from "./mock-smart-devices";
import type { SmartDevicesSnapshot } from "./smart-devices";

export function getSmartDevicesSnapshot(organizationSlug: string): SmartDevicesSnapshot {
  return {
    organizationSlug,
    source: "mock",
    devices: getMockSmartDevices(organizationSlug),
    groups: getMockSmartDeviceGroups(organizationSlug),
    capturedAt: new Date().toISOString(),
  };
}

export function getSmartDeviceMap(snapshot: SmartDevicesSnapshot) {
  return Object.fromEntries(
    snapshot.devices.map((device) => [device.id, device]),
  );
}

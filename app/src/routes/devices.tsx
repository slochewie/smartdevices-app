import { createFileRoute } from "@tanstack/react-router";

import { SmartDevicesPage } from "../components/smart-devices-page";

export const Route = createFileRoute("/devices")({ component: DevicesRoute });

function DevicesRoute() {
  return (
    <SmartDevicesPage pageId="devices" fallbackLabel="Devices" fallbackIcon="plug-zap">
      Placeholder for discovered MQTT/Zigbee2MQTT lights, switches, plugs,
      sensors, and controllable endpoints.
    </SmartDevicesPage>
  );
}

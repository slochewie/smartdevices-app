import { createFileRoute } from "@tanstack/react-router";

import { SmartDevicesPage } from "../components/smart-devices-page";

export const Route = createFileRoute("/groups")({ component: GroupsRoute });

function GroupsRoute() {
  return (
    <SmartDevicesPage pageId="groups" fallbackLabel="Groups" fallbackIcon="panels-top-left">
      Placeholder for Zigbee2MQTT groups and shared controls that can drive
      multiple devices together.
    </SmartDevicesPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";

import { SmartDevicesPage } from "../components/smart-devices-page";

export const Route = createFileRoute("/scenes")({ component: ScenesRoute });

function ScenesRoute() {
  return (
    <SmartDevicesPage pageId="scenes" fallbackLabel="Scenes" fallbackIcon="shield-check">
      Placeholder for saved device states such as lighting looks, open/close
      presets, and venue operating modes.
    </SmartDevicesPage>
  );
}

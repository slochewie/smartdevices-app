import { createFileRoute } from "@tanstack/react-router";

import { SmartDevicesPage } from "../components/smart-devices-page";

export const Route = createFileRoute("/automations")({ component: AutomationsRoute });

function AutomationsRoute() {
  return (
    <SmartDevicesPage pageId="automations" fallbackLabel="Automations" fallbackIcon="calendar-days">
      Placeholder for future schedules, triggers, and rules that execute scenes
      or device commands.
    </SmartDevicesPage>
  );
}

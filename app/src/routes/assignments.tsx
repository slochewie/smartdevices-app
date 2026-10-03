import { createFileRoute } from "@tanstack/react-router";

import { SmartDevicesPage } from "../components/smart-devices-page";

export const Route = createFileRoute("/assignments")({ component: AssignmentsRoute });

function AssignmentsRoute() {
  return (
    <SmartDevicesPage pageId="assignments" fallbackLabel="Assignments" fallbackIcon="users">
      Placeholder for organization-level access assignments and future per-device
      or per-group permissions.
    </SmartDevicesPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";

export const Route = createFileRoute("/$organizationSlug/assignments")({
  component: AssignmentsRoute,
});

function AssignmentsRoute() {
  const { organizationSlug } = Route.useParams();

  return (
    <AppShell organizationSlug={organizationSlug}>
      <SmartDevicesPage
        organizationSlug={organizationSlug}
        pageId="assignments"
        fallbackLabel="Assignments"
        fallbackIcon="users"
      >
        Placeholder for organization-level access assignments and future
        per-device or per-group permissions.
      </SmartDevicesPage>
    </AppShell>
  );
}

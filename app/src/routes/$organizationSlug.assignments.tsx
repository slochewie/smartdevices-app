import { createFileRoute } from "@tanstack/react-router";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";

export const Route = createFileRoute("/$organizationSlug/assignments")({
  component: AssignmentsRoute,
});

function AssignmentsRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);

  return (
    <SmartDevicesPage
      organization={organization}
      pageId="assignments"
      fallbackLabel="Assignments"
      fallbackIcon="users"
    >
      Placeholder for organization-level access assignments and future
      per-device or per-group permissions.
    </SmartDevicesPage>
  );
}

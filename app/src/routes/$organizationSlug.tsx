import { Outlet, createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";

export const Route = createFileRoute("/$organizationSlug")({
  component: OrganizationSmartDevicesLayout,
});

function OrganizationSmartDevicesLayout() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);

  return (
    <AppShell organization={organization}>
      <Outlet />
    </AppShell>
  );
}

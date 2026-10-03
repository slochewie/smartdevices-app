import { createFileRoute } from "@tanstack/react-router";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";

export const Route = createFileRoute("/$organizationSlug/scenes")({
  component: ScenesRoute,
});

function ScenesRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);

  return (
    <SmartDevicesPage
      organization={organization}
      pageId="scenes"
      fallbackLabel="Scenes"
      fallbackIcon="shield-check"
    >
      Placeholder for saved device states such as lighting looks, open/close
      presets, and venue operating modes.
    </SmartDevicesPage>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";

export const Route = createFileRoute("/$organizationSlug/automations")({
  component: AutomationsRoute,
});

function AutomationsRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);

  return (
    <SmartDevicesPage
      organization={organization}
      pageId="automations"
      fallbackLabel="Automations"
      fallbackIcon="calendar-days"
    >
      Placeholder for future schedules, triggers, and rules that execute scenes
      or device commands.
    </SmartDevicesPage>
  );
}

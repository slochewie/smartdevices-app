import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";

export const Route = createFileRoute("/$organizationSlug/automations")({
  component: AutomationsRoute,
});

function AutomationsRoute() {
  const { organizationSlug } = Route.useParams();

  return (
    <AppShell organizationSlug={organizationSlug}>
      <SmartDevicesPage
        organizationSlug={organizationSlug}
        pageId="automations"
        fallbackLabel="Automations"
        fallbackIcon="calendar-days"
      >
        Placeholder for future schedules, triggers, and rules that execute scenes
        or device commands.
      </SmartDevicesPage>
    </AppShell>
  );
}

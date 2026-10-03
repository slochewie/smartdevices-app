import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";

export const Route = createFileRoute("/$organizationSlug/scenes")({
  component: ScenesRoute,
});

function ScenesRoute() {
  const { organizationSlug } = Route.useParams();

  return (
    <AppShell organizationSlug={organizationSlug}>
      <SmartDevicesPage
        organizationSlug={organizationSlug}
        pageId="scenes"
        fallbackLabel="Scenes"
        fallbackIcon="shield-check"
      >
        Placeholder for saved device states such as lighting looks, open/close
        presets, and venue operating modes.
      </SmartDevicesPage>
    </AppShell>
  );
}

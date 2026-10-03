import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";

export const Route = createFileRoute("/$organizationSlug/groups")({
  component: GroupsRoute,
});

function GroupsRoute() {
  const { organizationSlug } = Route.useParams();

  return (
    <AppShell organizationSlug={organizationSlug}>
      <SmartDevicesPage
        organizationSlug={organizationSlug}
        pageId="groups"
        fallbackLabel="Groups"
        fallbackIcon="panels-top-left"
      >
        Placeholder for Zigbee2MQTT groups and shared controls that can drive
        multiple devices together.
      </SmartDevicesPage>
    </AppShell>
  );
}

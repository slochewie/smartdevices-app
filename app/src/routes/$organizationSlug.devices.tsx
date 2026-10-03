import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";

export const Route = createFileRoute("/$organizationSlug/devices")({
  component: DevicesRoute,
});

function DevicesRoute() {
  const { organizationSlug } = Route.useParams();

  return (
    <AppShell organizationSlug={organizationSlug}>
      <SmartDevicesPage
        organizationSlug={organizationSlug}
        pageId="devices"
        fallbackLabel="Devices"
        fallbackIcon="plug-zap"
      >
        Placeholder for discovered MQTT/Zigbee2MQTT lights, switches, plugs,
        sensors, and controllable endpoints.
      </SmartDevicesPage>
    </AppShell>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "#/components/app-shell";
import { SmartDevicesPage } from "#/components/smart-devices-page";
import { createSmartDevicesOrganizationContext } from "#/lib/organization-context";

export const Route = createFileRoute("/$organizationSlug/devices")({
  component: DevicesRoute,
});

function DevicesRoute() {
  const { organizationSlug } = Route.useParams();
  const organization = createSmartDevicesOrganizationContext(organizationSlug);

  return (
    <AppShell organization={organization}>
      <SmartDevicesPage
        organization={organization}
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

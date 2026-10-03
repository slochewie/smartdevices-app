import type { ReactNode } from "react";
import { appDefinitionsById } from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";
import type { SmartDevicesOrganizationContext } from "#/lib/organization-context";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];

type SmartDevicesPageProps = {
  organization: SmartDevicesOrganizationContext;
  pageId: string;
  fallbackLabel: string;
  fallbackIcon: string;
  children: ReactNode;
};

export function SmartDevicesPage({
  organization,
  pageId,
  fallbackLabel,
  fallbackIcon,
  children,
}: SmartDevicesPageProps) {
  const page = SMART_DEVICES_APP.pages.find((candidate) => candidate.id === pageId);
  const label = page?.label ?? fallbackLabel;
  const icon = page?.icon ?? fallbackIcon;

  return (
    <section className="page-card">
      <div className="page-card__icon" aria-hidden="true">
        <NiteOwlNavigationIcon icon={icon} />
      </div>
      <div>
        <p className="page-card__eyebrow">Smart Devices · /{organization.slug}</p>
        <h2>{label}</h2>
        <p className="page-card__description">{children}</p>
      </div>
    </section>
  );
}

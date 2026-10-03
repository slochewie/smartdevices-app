import type { ReactNode } from "react";
import { appDefinitionsById } from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];

type SmartDevicesPageProps = {
  pageId: string;
  fallbackLabel: string;
  fallbackIcon: string;
  children: ReactNode;
};

export function SmartDevicesPage({
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
        <p className="page-card__eyebrow">Smart Devices</p>
        <h2>{label}</h2>
        <p className="page-card__description">{children}</p>
      </div>
    </section>
  );
}

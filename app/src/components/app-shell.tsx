import type { ReactNode } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  appDefinitionsById,
  buildNavigation,
  getDefaultAppUrls,
  getDeploymentBrand,
} from "@niteowl/app-config";
import { NiteOwlNavigationIcon, useCurrentHostname } from "@niteowl/ui";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];

export function AppShell({ children }: { children: ReactNode }) {
  const location = useLocation();
  const hostname = useCurrentHostname() ?? "localhost";
  const urls = getDefaultAppUrls(hostname);
  const brand = getDeploymentBrand(hostname);
  const navigation = buildNavigation({
    currentApp: "smart-devices",
    currentPath: location.pathname,
    urls,
    canAccess: () => true,
  });

  const primaryItems = navigation.primary.flatMap((section) => section.items);
  const appItems = navigation.apps.flatMap((section) => section.items);

  return (
    <div className="app-shell">
      <aside className="app-sidebar" aria-label="Smart Devices navigation">
        <Link to="/" className="app-sidebar__brand">
          <span className="app-sidebar__brand-icon" aria-hidden="true">
            <NiteOwlNavigationIcon icon={SMART_DEVICES_APP.icon} />
          </span>
          <span className="app-sidebar__brand-text">
            <span>{brand}</span>
            <strong>{SMART_DEVICES_APP.label}</strong>
          </span>
        </Link>

        <nav className="app-nav" aria-label="Primary">
          <p className="app-nav__label">Smart Devices</p>
          {primaryItems.map((item) => (
            <Link
              key={item.id}
              to={item.href}
              className="app-nav__item"
              data-active={item.active ? "true" : undefined}
            >
              <NiteOwlNavigationIcon icon={item.icon} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <nav className="app-nav app-nav--apps" aria-label="Apps">
          <p className="app-nav__label">Apps</p>
          {appItems.map((item) => (
            <a key={item.id} href={item.href} className="app-nav__item">
              <NiteOwlNavigationIcon icon={item.icon} />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      <div className="app-frame">
        <header className="app-header">
          <div>
            <p className="app-header__eyebrow">{brand}</p>
            <h1>{SMART_DEVICES_APP.label}</h1>
          </div>
          <span className="app-header__status">Auth pending</span>
        </header>

        <main className="app-main">{children}</main>
      </div>
    </div>
  );
}

import { createFileRoute, Link } from "@tanstack/react-router";
import { appDefinitionsById } from "@niteowl/app-config";
import { NiteOwlNavigationIcon } from "@niteowl/ui/navigation";

const SMART_DEVICES_APP = appDefinitionsById["smart-devices"];
const EXAMPLE_ORGANIZATION_SLUG = "mccarthys-irish-pub";

export const Route = createFileRoute("/")({ component: OrganizationSlugRequired });

function OrganizationSlugRequired() {
  return (
    <main className="public-landing">
      <section className="public-landing__card">
        <div className="public-landing__icon" aria-hidden="true">
          <NiteOwlNavigationIcon icon={SMART_DEVICES_APP.icon} />
        </div>
        <p className="public-landing__eyebrow">NiteOwl.dev</p>
        <h1>{SMART_DEVICES_APP.label}</h1>
        <p>
          Smart Devices routes are organization-scoped so members of multiple
          organizations can bookmark a direct PWA URL for the right venue.
        </p>
        <code>/:organizationSlug</code>
        <Link to={`/${EXAMPLE_ORGANIZATION_SLUG}`} className="public-landing__link">
          Open example organization
        </Link>
      </section>
    </main>
  );
}

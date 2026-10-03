export type SmartDevicesOrganizationContext = {
  slug: string;
  basePath: string;
  pagePath: (path: string) => string;
};

export function createSmartDevicesOrganizationContext(
  slug: string,
): SmartDevicesOrganizationContext {
  const normalizedSlug = slug.trim();
  const basePath = `/${normalizedSlug}`;

  return {
    slug: normalizedSlug,
    basePath,
    pagePath: (path) => (path === "/" ? basePath : `${basePath}${path}`),
  };
}

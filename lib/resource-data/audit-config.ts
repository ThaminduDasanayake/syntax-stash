/**
 * Configuration for the automated resource health check script (scripts/check-resource-health.ts).
 * Add URLs here to customize how specific resources are audited.
 */

export interface AuditConfig {
  /**
   * URLs where you intentionally wrote a custom editorial description.
   * - The health check will NOT flag description changes from the website.
   * - NOTE: If the resource has an empty description in your data, it will STILL notify you.
   */
  skipDescriptionChanges: string[];

  /**
   * URLs where you intentionally picked a custom favicon (e.g. /github.svg or local PNG).
   * - The health check will NOT flag favicon changes or suggestions for these URLs.
   */
  skipFaviconChecks: string[];

  /**
   * URLs where you intentionally uploaded a custom screenshot / OpenGraph image.
   * - The health check will NOT flag missing or changed ogImage for these URLs.
   */
  skipOgImageChecks: string[];

  /**
   * URLs to completely skip from health checks.
   */
  skipAll: string[];
}

export const AUDIT_CONFIG: AuditConfig = {
  skipAll: [],
  skipDescriptionChanges: [],
  skipFaviconChecks: [],
  skipOgImageChecks: [],
};

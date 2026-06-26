import { SiteFooter, SiteHeader } from "@/global/components/shared";

/**
 * Chrome shared by the management screens (dashboard, templates, import,
 * settings, donate). The builder lives outside this group so it can use the
 * full viewport.
 */
export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}

import { AdminPageShell } from "@/components/admin-page-shell";
import { SettingsContent } from "@/app/settings/page";
import { TPO_PROFILE } from "@/lib/role-profiles";

export default function TpoSettingsPage() {
  return (
    <AdminPageShell title="Settings">
      <SettingsContent readOnly profile={TPO_PROFILE} />
    </AdminPageShell>
  );
}

import { AdminPageShell } from "@/components/admin-page-shell";
import { SettingsContent } from "@/app/settings/page";
import { HOD_PROFILE } from "@/lib/role-profiles";

export default function HodSettingsPage() {
  return (
    <AdminPageShell title="Settings">
      <SettingsContent readOnly profile={HOD_PROFILE} />
    </AdminPageShell>
  );
}

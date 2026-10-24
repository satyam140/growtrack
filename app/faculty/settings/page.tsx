import { AdminPageShell } from "@/components/admin-page-shell";
import { SettingsContent } from "@/app/settings/page";

export default function FacultySettingsPage() {
  return (
    <AdminPageShell title="Settings">
      <SettingsContent readOnly />
    </AdminPageShell>
  );
}

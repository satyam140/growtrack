<<<<<<< HEAD
import { ProfileSettings } from "@/components/role/profile-view";

export default function TpoSettingsPage() {
  return <ProfileSettings title="TPO settings" />;
}
=======
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
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

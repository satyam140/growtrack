<<<<<<< HEAD
import { ProfileSettings } from "@/components/role/profile-view";

export default function HodSettingsPage() {
  return <ProfileSettings title="HOD settings" />;
}
=======
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
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

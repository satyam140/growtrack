<<<<<<< HEAD
import { ProfileSettings } from "@/components/role/profile-view";

export default function FacultySettingsPage() {
  return <ProfileSettings title="Faculty settings" />;
}
=======
import { AdminPageShell } from "@/components/admin-page-shell";
import { SettingsContent } from "@/app/settings/page";

export default function FacultySettingsPage() {
  return (
    <AdminPageShell title="Settings">
      <SettingsContent readOnly />
    </AdminPageShell>
  );
}
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

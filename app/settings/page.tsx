"use client";

import { useEffect, useState, type FormEvent } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, Save } from "lucide-react";
import { AdminPageShell } from "@/components/admin-page-shell";
import {
  ADMIN_SETTINGS_STORAGE_KEY,
  DEFAULT_ADMIN_SETTINGS,
  readAdminSettings,
  type AdminSettings,
} from "@/lib/admin-settings";
<<<<<<< HEAD

const inputClass =
  "w-full rounded-md border border-[#dfe5dc] bg-white px-3 py-2.5 text-[15px] text-[#2b382e] outline-none focus:border-[#57906f] focus:ring-2 focus:ring-[#e0eee4]";

export default function SettingsPage() {
=======
import type { RoleProfile } from "@/lib/role-profiles";

const inputClass =
  "w-full rounded-md border border-[#dfe5dc] bg-white px-3 py-2.5 text-sm text-[#2b382e] outline-none focus:border-[#57906f] focus:ring-2 focus:ring-[#e0eee4]";

export function SettingsContent({
  readOnly = false,
  profile,
}: {
  readOnly?: boolean;
  profile?: RoleProfile;
}) {
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
  const [settings, setSettings] = useState<AdminSettings>(
    DEFAULT_ADMIN_SETTINGS,
  );
  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
<<<<<<< HEAD

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Read browser-only settings after the initial render to avoid hydration mismatch.
      setSettings(readAdminSettings());
=======
  const [profileForm, setProfileForm] = useState({ name: "", email: "" });

  useEffect(() => {
    try {
      const savedSettings = readAdminSettings();
      // eslint-disable-next-line react-hooks/set-state-in-effect -- Hydrate browser-persisted settings after mount.
      setSettings(savedSettings);
      if (profile) {
        const savedProfile = window.localStorage.getItem(profile.storageKey);
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile) as Partial<Pick<RoleProfile, "name" | "email">>;
          setProfileForm({
            name: typeof parsed.name === "string" ? parsed.name : profile.name,
            email: typeof parsed.email === "string" ? parsed.email : profile.email,
          });
        } else {
          setProfileForm({ name: profile.name, email: profile.email });
        }
      }
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? `Could not load saved settings: ${loadError.message}`
          : "Could not load saved settings.",
      );
    } finally {
      setReady(true);
    }
<<<<<<< HEAD
  }, []);
=======
  }, [profile]);
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

  function update<K extends keyof AdminSettings>(
    key: K,
    value: AdminSettings[K],
  ) {
    setSettings((current) => ({ ...current, [key]: value }));
    setNotice("");
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setNotice("");

<<<<<<< HEAD
=======
    if (profile) {
      const name = profileForm.name.trim();
      const email = profileForm.email.trim();
      if (!name) {
        setError("Name is required.");
        return;
      }
      if (email && email !== "Not provided" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setError("Enter a valid email address or leave it as Not provided.");
        return;
      }
      try {
        const updatedProfile = { name, email: email || "Not provided" };
        window.localStorage.setItem(profile.storageKey, JSON.stringify(updatedProfile));
        setProfileForm(updatedProfile);
        setNotice("Profile details saved. They will be available after refreshing.");
      } catch (saveError) {
        setError(
          saveError instanceof Error
            ? `Could not save profile details: ${saveError.message}`
            : "Could not save profile details.",
        );
      }
      return;
    }

>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    if (!settings.name.trim() || !settings.role.trim()) {
      setError("Administrator name and role are required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email.trim())) {
      setError("Enter a valid administrator email address.");
      return;
    }
    if (
      !Number.isFinite(settings.minimumAttendance) ||
      settings.minimumAttendance < 0 ||
      settings.minimumAttendance > 100 ||
      !Number.isFinite(settings.minimumAcademicScore) ||
      settings.minimumAcademicScore < 0 ||
      settings.minimumAcademicScore > 100
    ) {
      setError("Alert thresholds must be numbers between 0 and 100.");
      return;
    }

    try {
      const updated = {
        ...settings,
        name: settings.name.trim(),
        email: settings.email.trim(),
        role: settings.role.trim(),
      };
      window.localStorage.setItem(
        ADMIN_SETTINGS_STORAGE_KEY,
        JSON.stringify(updated),
      );
      setSettings(updated);
      setNotice("Settings saved. They will be available after refreshing.");
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? `Could not save settings: ${saveError.message}`
          : "Could not save settings.",
      );
    }
  }

  function resetSettings() {
    if (
      !window.confirm(
        "Reset all administrator settings to their defaults? This will replace your saved preferences.",
      )
    ) {
      return;
    }

    setError("");
    try {
<<<<<<< HEAD
=======
      if (profile) {
        window.localStorage.removeItem(profile.storageKey);
        setProfileForm({ name: profile.name, email: profile.email });
        setNotice("Profile details were reset to defaults.");
        return;
      }
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
      window.localStorage.setItem(
        ADMIN_SETTINGS_STORAGE_KEY,
        JSON.stringify(DEFAULT_ADMIN_SETTINGS),
      );
      setSettings(DEFAULT_ADMIN_SETTINGS);
      setNotice("Settings were reset to defaults.");
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? `Could not reset settings: ${resetError.message}`
          : "Could not reset settings.",
      );
    }
  }

  if (!ready) {
    return (
<<<<<<< HEAD
      <AdminPageShell title="Settings">
        <p className="text-[15px] text-[#748075]" role="status">
          Loading settings...
        </p>
      </AdminPageShell>
=======
      <div>
        <p className="text-sm text-[#748075]" role="status">
          Loading settings...
        </p>
      </div>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    );
  }

  return (
<<<<<<< HEAD
    <AdminPageShell title="Settings">
      <section className="mb-7">
        <p className="mb-2 text-[13px] font-bold tracking-[1.7px] text-[#28684e]">
          ADMINISTRATION
        </p>
        <h1 className="text-[27px] font-semibold leading-tight tracking-[-1px] sm:text-[30px]">
          Administrator settings
        </h1>
        <p className="mt-2 max-w-2xl text-[14.5px] leading-5 text-[#7a847b]">
          Manage your profile, dashboard preferences, notifications, and
          academic alert thresholds.
=======
    <div>
      <section className="mb-7">
        <p className="mb-2 text-[10px] font-bold tracking-[1.7px] text-[#28684e]">
          ADMINISTRATION
        </p>
        <h1 className="text-[27px] font-semibold leading-tight tracking-[-1px] sm:text-[30px]">
          {profile?.title ?? "Administrator settings"}
        </h1>
        <p className="mt-2 max-w-2xl text-[12px] leading-5 text-[#7a847b]">
          {profile?.description ??
            "Manage your profile, dashboard preferences, notifications, and academic alert thresholds."}
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        </p>
      </section>

      {error && (
        <div
          role="alert"
<<<<<<< HEAD
          className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-[15px] text-red-800"
=======
          className="mb-5 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        >
          <AlertTriangle size={17} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {notice && (
        <div
          role="status"
<<<<<<< HEAD
          className="mb-5 flex items-center gap-2 rounded-md border border-[#dce8df] bg-[#f5faf6] px-4 py-3 text-[15px] text-[#28654d]"
=======
          className="mb-5 flex items-center gap-2 rounded-md border border-[#dce8df] bg-[#f5faf6] px-4 py-3 text-sm text-[#28654d]"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        >
          <CheckCircle2 size={17} />
          {notice}
        </div>
      )}

      <form onSubmit={saveSettings} className="space-y-5">
<<<<<<< HEAD
        <SettingsSection
          title="Administrator profile"
          description="These details are stored locally in this browser."
=======
        <fieldset disabled={readOnly && !profile} className="space-y-5">
        <SettingsSection
          title={profile?.profileTitle ?? "Administrator profile"}
          description="These details are stored locally in this browser for this demo workspace."
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
<<<<<<< HEAD
                value={settings.name}
                onChange={(event) => update("name", event.target.value)}
=======
                value={profile ? profileForm.name : settings.name}
                onChange={(event) =>
                  profile
                    ? setProfileForm((current) => ({ ...current, name: event.target.value }))
                    : update("name", event.target.value)
                }
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                autoComplete="name"
                required
              />
            </Field>
            <Field label="Email">
              <input
                className={inputClass}
                type="email"
<<<<<<< HEAD
                value={settings.email}
                onChange={(event) => update("email", event.target.value)}
=======
                value={profile ? profileForm.email : settings.email}
                onChange={(event) =>
                  profile
                    ? setProfileForm((current) => ({ ...current, email: event.target.value }))
                    : update("email", event.target.value)
                }
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
<<<<<<< HEAD
                value={settings.role}
                onChange={(event) => update("role", event.target.value)}
=======
                value={profile?.role ?? settings.role}
                onChange={(event) => update("role", event.target.value)}
                disabled={Boolean(profile)}
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
                required
              />
            </Field>
          </div>
        </SettingsSection>

<<<<<<< HEAD
        <SettingsSection
          title="General preferences"
          description="Preference selections are saved with your administrator settings."
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Dashboard theme">
              <select
                className={inputClass}
                value={settings.theme}
                onChange={(event) =>
                  update("theme", event.target.value as AdminSettings["theme"])
                }
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">Use system preference</option>
              </select>
            </Field>
            <div className="space-y-3">
=======
        {!profile && <><SettingsSection
          title="General preferences"
          description="Preference selections are saved with your administrator settings."
        >
          <div className="space-y-3">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
              <Toggle
                label="Email notifications"
                description="Receive administrative updates by email."
                checked={settings.emailNotifications}
                onChange={(checked) => update("emailNotifications", checked)}
              />
              <Toggle
                label="Intervention reminders"
                description="Keep follow-up reminders enabled."
                checked={settings.interventionReminders}
                onChange={(checked) => update("interventionReminders", checked)}
              />
<<<<<<< HEAD
            </div>
=======
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
          </div>
        </SettingsSection>

        <SettingsSection
          title="Academic alert thresholds"
          description="Students below either threshold are listed for support on the Interventions page."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Minimum attendance percentage">
              <NumberInput
                value={settings.minimumAttendance}
                onChange={(value) => update("minimumAttendance", value)}
              />
            </Field>
            <Field label="Minimum academic score">
              <NumberInput
                value={settings.minimumAcademicScore}
                onChange={(value) => update("minimumAcademicScore", value)}
              />
            </Field>
          </div>
<<<<<<< HEAD
          <p className="mt-3 text-[13.5px] text-[#556057]">
            Both values must be between 0 and 100.
          </p>
        </SettingsSection>
=======
          <p className="mt-3 text-xs text-[#89938a]">
            Both values must be between 0 and 100.
          </p>
        </SettingsSection></>}
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
<<<<<<< HEAD
            className="inline-flex items-center gap-2 rounded-md bg-[#28684e] px-4 py-2.5 text-[15px] font-semibold text-white hover:bg-[#1e573f]"
=======
            className="inline-flex items-center gap-2 rounded-md bg-[#28684e] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#1e573f]"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
          >
            <Save size={16} />
            Save settings
          </button>
          <button
            type="button"
            onClick={resetSettings}
<<<<<<< HEAD
            className="inline-flex items-center gap-2 rounded-md border border-[#dfe5dc] bg-white px-4 py-2.5 text-[15px] font-semibold text-[#46564a] hover:bg-[#f5f7f4]"
=======
            className="inline-flex items-center gap-2 rounded-md border border-[#dfe5dc] bg-white px-4 py-2.5 text-sm font-semibold text-[#46564a] hover:bg-[#f5f7f4]"
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
          >
            <RotateCcw size={16} />
            Reset to defaults
          </button>
        </div>
<<<<<<< HEAD
      </form>
=======
        </fieldset>
      </form>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <AdminPageShell title="Settings">
      <SettingsContent />
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    </AdminPageShell>
  );
}

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#e2e7df] bg-white p-5 sm:p-6">
      <h2 className="font-semibold text-[#2c4031]">{title}</h2>
<<<<<<< HEAD
      <p className="mb-5 mt-1 text-[13.5px] leading-5 text-[#556057]">
=======
      <p className="mb-5 mt-1 text-xs leading-5 text-[#89938a]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
        {description}
      </p>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
<<<<<<< HEAD
    <label className="block text-[15px] font-medium text-[#46564a]">
=======
    <label className="block text-sm font-medium text-[#46564a]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
      <span className="mb-1.5 block">{label}</span>
      {children}
    </label>
  );
}

function NumberInput({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        className={inputClass}
        type="number"
        min={0}
        max={100}
        step={1}
        value={value}
        onChange={(event) => onChange(event.target.valueAsNumber)}
        required
      />
<<<<<<< HEAD
      <span className="text-[15px] text-[#748075]">%</span>
=======
      <span className="text-sm text-[#748075]">%</span>
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start justify-between gap-4 rounded-md border border-[#e8ece6] p-3">
      <span>
<<<<<<< HEAD
        <span className="block text-[15px] font-medium text-[#46564a]">{label}</span>
        <span className="mt-1 block text-[13.5px] leading-5 text-[#556057]">
=======
        <span className="block text-sm font-medium text-[#46564a]">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-[#89938a]">
>>>>>>> 241ceafd543cf5aa4e4a94777b87d4d27d569ebd
          {description}
        </span>
      </span>
      <input
        className="mt-1 h-4 w-4 accent-[#28684e]"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
    </label>
  );
}

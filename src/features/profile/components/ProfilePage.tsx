import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

import { getCurrentUser } from "@/features/auth/utils/authStorage";
import ChangePasswordPage from "@/features/profile/components/ChangePasswordPage.tsx";

type TabId = "profile" | "security";

type ProfileFormState = {
  firstName: string;
  lastName: string;
  email: string;
  institution: string;
  department: string;
  country: string;
};

const MOCK_STATS = [
  {
    label: "FOLLOWED TOPICS",
    value: "12",
    accent: "from-[#FFF1E8] to-[#FFE0CC]",
    valueClass: "text-[#F27229]",
  },
  {
    label: "FOLLOWED AUTHORS",
    value: "31",
    accent: "from-[#EEF8FF] to-[#DDF0FF]",
    valueClass: "text-[#2F80ED]",
  },
  {
    label: "BOOKMARKED PAPERS",
    value: "184",
    accent: "from-[#F3FBEA] to-[#E5F6CB]",
    valueClass: "text-[#7BBF43]",
  },
];

function UserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Avatar({
  firstName,
  lastName,
}: {
  firstName: string;
  lastName: string;
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();

  return (
    <div className="shrink-0">
      <div className="flex h-24 w-24 items-center justify-center rounded-[1.75rem] border border-black bg-white text-3xl font-bold text-black shadow-[8px_8px_0_0_rgba(0,0,0,0.08)] font-title">
        {initials}
      </div>
    </div>
  );
}

function StatsRow() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {MOCK_STATS.map((item) => (
        <div
          key={item.label}
          className={`flex min-h-[122px] flex-col justify-between rounded-[1.5rem] border border-black bg-gradient-to-br ${item.accent} px-6 py-5`}
        >
          <p className="font-subtext text-[11px] font-semibold uppercase tracking-[0.22em] text-black/65">
            {item.label}
          </p>
          <p
            className={`flex flex-1 items-center text-4xl font-extrabold ${item.valueClass} font-title`}
          >
            {item.value}
          </p>
        </div>
      ))}
    </div>
  );
}

function SettingsNav({
  active,
  onChange,
}: {
  active: TabId;
  onChange: (tab: TabId) => void;
}) {
  const tabs: { id: TabId; label: string; icon: ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon /> },
    { id: "security", label: "Security", icon: <LockIcon /> },
  ];

  return (
    <aside className="w-full rounded-[1.75rem] border border-black bg-white p-4 lg:w-64">
      <div className="space-y-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChange(tab.id)}
              className={`flex w-full items-center gap-3 rounded-2xl border px-4 py-4 text-left transition-all ${
                isActive
                  ? "border-black bg-white text-black"
                  : "border-transparent bg-white text-black/70 hover:border-black"
              }`}
            >
              <span className={isActive ? "text-[#F27229]" : "text-[#7BBF43]"}>
                {tab.icon}
              </span>
              <span className="text-lg font-semibold font-title">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  disabled?: boolean;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-black font-subtext">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        disabled={disabled}
        className={`h-12 w-full rounded-2xl border border-black bg-white px-4 text-[15px] text-black outline-none transition-colors placeholder:text-black/35 ${
          disabled ? "cursor-not-allowed opacity-75" : "focus:border-black"
        }`}
      />
    </div>
  );
}

function ProfileTab({
  user,
  onProfileSave,
}: {
  user: ReturnType<typeof getCurrentUser>;
  onProfileSave: (profile: ProfileFormState) => void;
}) {
  const buildInitialForm = (): ProfileFormState => ({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    institution: "",
    department: "",
    country: "",
  });

  const [form, setForm] = useState<ProfileFormState>(buildInitialForm);
  const [editing, setEditing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function updateField(field: keyof ProfileFormState) {
    return (event: ChangeEvent<HTMLInputElement>) => {
      setForm((previous) => ({ ...previous, [field]: event.target.value }));
      setDirty(true);
      setSaved(false);
    };
  }

  async function handleSave(event: FormEvent) {
    event.preventDefault();
    if (!editing) {
      return;
    }

    setSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onProfileSave(form);
    setSaving(false);
    setEditing(false);
    setDirty(false);
    setSaved(true);
  }

  function handleEdit() {
    setEditing(true);
    setSaved(false);
  }

  function handleDiscard() {
    setForm(buildInitialForm());
    setEditing(false);
    setDirty(false);
    setSaved(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-black font-title">
            Profile &amp; Setting
          </h2>
        </div>
        <button
          type="button"
          onClick={handleEdit}
          className="h-11 rounded-2xl border border-black bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-[#FFF6ED]"
        >
          Edit Profile
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="rounded-[1.75rem] border border-black bg-white p-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <Field
              label="First name"
              value={form.firstName}
              onChange={updateField("firstName")}
              placeholder="Enter first name"
              disabled={!editing}
            />
            <Field
              label="Last name"
              value={form.lastName}
              onChange={updateField("lastName")}
              placeholder="Enter last name"
              disabled={!editing}
            />
            <Field
              label="Email"
              value={form.email}
              onChange={updateField("email")}
              placeholder="Enter email"
              readOnly
              disabled
            />
            <Field
              label="Institution"
              value={form.institution}
              onChange={updateField("institution")}
              placeholder="Enter institution"
              disabled={!editing}
            />
            <Field
              label="Department"
              value={form.department}
              onChange={updateField("department")}
              placeholder="Enter department"
              disabled={!editing}
            />
            <Field
              label="Country"
              value={form.country}
              onChange={updateField("country")}
              placeholder="Enter country"
              disabled={!editing}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-black pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-h-6 text-sm font-subtext text-black/70">
            {saving && <span className="text-[#F27229]">Saving changes...</span>}
            {!saving && saved && (
              <span className="text-[#2F80ED]">Profile updated locally. Ready for DB save flow.</span>
            )}
            {!saving && !saved && dirty && editing && (
              <span className="text-[#A66B1F]">You have unsaved changes.</span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {dirty && (
              <button
                type="button"
                onClick={handleDiscard}
                className="h-11 rounded-2xl border border-black bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
              >
                Discard
              </button>
            )}
            <button
              type="submit"
              disabled={!editing || !dirty || saving}
              className="h-11 rounded-2xl border border-black bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#F27229] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function ProfilePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const user = getCurrentUser();

  const initialProfile: ProfileFormState = {
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    email: user?.email ?? "",
    institution: "",
    department: "",
    country: "",
  };

  const [savedProfile, setSavedProfile] = useState<ProfileFormState>(initialProfile);

  const activeTab: TabId = searchParams.get("tab") === "security" ? "security" : "profile";

  const firstName = savedProfile.firstName || user?.firstName || "User";
  const lastName = savedProfile.lastName || user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();

  const summaryParts = [savedProfile.department, savedProfile.institution].filter(Boolean);
  const profileSummary =
    summaryParts.length > 0
      ? summaryParts.join(" · ")
      : "Department and institution will appear here after you save your profile.";

  function handleTabChange(tab: TabId) {
    setSearchParams({ tab });
  }

  return (
    <div className="min-h-screen bg-[#FFFEFC]">
      <div className="mx-auto max-w-[1380px] px-5 py-8 lg:px-8">
        <div className="space-y-6">
          <div className="space-y-6">
            <div className="mb-6">
              <h1 className="text-4xl font-extrabold text-black font-title md:text-5xl">
                Profile &amp; Settings
              </h1>
            </div>

            <div className="overflow-hidden rounded-[2rem] border border-black bg-white">
              <div className="grid min-h-[320px] grid-rows-2">
                <div className="relative bg-[linear-gradient(135deg,rgba(242,114,41,0.14),rgba(47,128,237,0.12),rgba(123,191,67,0.10))]">
                  <div className="absolute bottom-6 left-8 right-8 flex items-end justify-between">
                    <h2 className="text-left text-3xl font-bold text-black font-title md:text-5xl">
                      {fullName}
                    </h2>
                  </div>
                </div>

                <div className="relative bg-white px-8 pt-6">
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                    <Avatar firstName={firstName} lastName={lastName} />
                  </div>

                  <div className="flex h-full items-start justify-center pt-12">
                    <p className="text-center text-base text-black/65 font-subtext">
                      {profileSummary}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <StatsRow />

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
            <SettingsNav active={activeTab} onChange={handleTabChange} />

            <section className="min-w-0 flex-1 rounded-[2rem] border border-black bg-white p-6 shadow-[10px_10px_0_0_rgba(0,0,0,0.04)]">
              {activeTab === "profile" ? (
                <ProfileTab user={user} onProfileSave={setSavedProfile} />
              ) : (
                <ChangePasswordPage />
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { useSearchParams } from "react-router-dom";

import { getCurrentUser } from "@/features/auth/utils/authStorage";
import ChangePasswordPage from "@/features/profile/components/ChangePasswordPage";
import { useProfileSummary } from "@/features/profile/hooks/useProfileSummary";
import { useProfileForm } from "@/features/profile/hooks/useProfileForm";
import { useCurrentProfile } from "@/features/profile/hooks/useCurrentProfile";
import type {
  ProfileFormState,
  ProfileTabId,
} from "@/features/profile/types/profile.types";

function UserIcon() {
  return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
  );
}

function LockIcon() {
  return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
  );
}

function Avatar({
                  firstName,
                  lastName,
                  avatarUrl,
                }: {
  firstName: string;
  lastName: string;
  avatarUrl?: string | null;
}) {
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
  const [hasImageError, setHasImageError] = useState(false);
  const shouldShowImage = Boolean(avatarUrl) && !hasImageError;

  return (
      <div className="shrink-0">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-3xl border border-black bg-white text-3xl font-bold text-black font-title">
          {shouldShowImage ? (
              <img
                  key={avatarUrl}
                  src={avatarUrl ?? ""}
                  alt={`${firstName} ${lastName}`.trim() || "User avatar"}
                  className="h-full w-full object-cover"
                  onError={() => setHasImageError(true)}
              />
          ) : (
              initials
          )}
        </div>
      </div>
  );
}

function StatsRow({ data }: { data: { label: string; value: string | number; accent: string; valueClass: string }[] }) {
  return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.map((item) => (
            <div
                key={item.label}
                className={`flex min-h-30.5 flex-col justify-between rounded-3xl border border-black bg-linear-to-br ${item.accent} px-6 py-5`}
            >
              <p className="font-subtext text-[11px] font-semibold uppercase tracking-[0.22em] text-black/65">
                {item.label}
              </p>
              <p className={`flex flex-1 items-center text-4xl font-extrabold ${item.valueClass} font-title`}>
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
  active: ProfileTabId;
  onChange: (tab: ProfileTabId) => void;
}) {
  const tabs: { id: ProfileTabId; label: string; icon: ReactNode }[] = [
    { id: "profile", label: "Profile", icon: <UserIcon /> },
    { id: "security", label: "Security", icon: <LockIcon /> },
  ];

  return (
      <aside className="w-full rounded-[1.25rem] border border-black bg-white p-4 lg:w-64">
        <div className="space-y-2">
          {tabs.map((tab, index) => {
            const isActive = active === tab.id;
            return (
                <div key={tab.id}>
                  <button
                      type="button"
                      onClick={() => onChange(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-lg border px-4 py-4 text-left transition-all ${
                          isActive
                              ? "border-black bg-white text-black"
                              : "border-transparent bg-white text-black/70 hover:border-black"
                      }`}
                  >
                    <span className={isActive ? "text-[#F27229]" : "text-[#7BBF43]"}>{tab.icon}</span>
                    <span className="text-lg font-semibold font-title">{tab.label}</span>
                  </button>
                  {index < tabs.length - 1 ? <div className="mx-3 my-3 h-0.5 bg-black/30" /> : null}
                </div>
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
        <label className="mb-2 block text-sm font-semibold text-black font-subtext">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            readOnly={readOnly}
            disabled={disabled}
            className={`h-12 w-full rounded-lg border border-black bg-white px-4 text-[15px] text-black outline-none transition-colors placeholder:text-black/35 ${
                disabled ? "cursor-not-allowed opacity-75" : "focus:border-black"
            }`}
        />
      </div>
  );
}

function ProfileTab({
                      savedProfile,
                      onSaved,
                    }: {
  savedProfile: ProfileFormState;
  onSaved: (profile: ProfileFormState) => void;
}) {
  const { form, editing, dirty, saving, saved, error, updateField, startEdit, discard, save } =
      useProfileForm(savedProfile, onSaved);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await save();
  }

  return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold text-black font-title">Profile &amp; Setting</h2>
          </div>
          <button
              type="button"
              onClick={startEdit}
              className="h-11 rounded-lg border border-black bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-[#FFF6ED]"
          >
            Edit Profile
          </button>
        </div>

        {error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="rounded-[1.25rem] border border-black bg-white p-5">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <Field
                  label="First name"
                  value={form.firstName}
                  onChange={(e) => updateField("firstName")(e.target.value)}
                  placeholder="Enter first name"
                  disabled={!editing}
              />
              <Field
                  label="Last name"
                  value={form.lastName}
                  onChange={(e) => updateField("lastName")(e.target.value)}
                  placeholder="Enter last name"
                  disabled={!editing}
              />
              <Field
                  label="Email"
                  value={form.email}
                  onChange={(e) => updateField("email")(e.target.value)}
                  placeholder="Enter email"
                  readOnly
                  disabled
              />
              <Field
                  label="Institution"
                  value={form.institution}
                  onChange={(e) => updateField("institution")(e.target.value)}
                  placeholder="Enter institution"
                  disabled={!editing}
              />
              <Field
                  label="Department"
                  value={form.department}
                  onChange={(e) => updateField("department")(e.target.value)}
                  placeholder="Enter department"
                  disabled={!editing}
              />
              <Field
                  label="Country"
                  value={form.country}
                  onChange={(e) => updateField("country")(e.target.value)}
                  placeholder="Enter country"
                  disabled={!editing}
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-black pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="min-h-6 text-sm font-subtext text-black/70">
              {saving && <span className="text-[#F27229]">Saving changes...</span>}
              {!saving && saved && <span className="text-[#2F80ED]">Profile updated successfully.</span>}
              {!saving && !saved && dirty && editing && (
                  <span className="text-[#A66B1F]">You have unsaved changes.</span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {editing && (
                  <button
                      type="button"
                      onClick={discard}
                      disabled={saving}
                      className="h-11 rounded-lg border border-black bg-white px-5 text-sm font-semibold text-black transition-colors hover:bg-black hover:text-white"
                  >
                    Discard
                  </button>
              )}
              <button
                  type="submit"
                  disabled={!editing || !dirty || saving}
                  className="h-11 rounded-lg border border-black bg-black px-5 text-sm font-semibold text-white transition-colors hover:bg-[#F27229] disabled:cursor-not-allowed disabled:opacity-50"
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
  const user = getCurrentUser(); // chỉ dùng cho avatar/name hiển thị tức thì, không dùng cho form

  const { stats } = useProfileSummary();

  // ── Lấy dữ liệu mới nhất từ /me, không phụ thuộc cache cũ ──────────────────
  const { profile: savedProfile, setProfile: setSavedProfile, isLoading } = useCurrentProfile();

  const activeTab: ProfileTabId =
      searchParams.get("tab") === "security" ? "security" : "profile";

  const firstName = savedProfile.firstName || user?.firstName || "User";
  const lastName = savedProfile.lastName || user?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  const avatarUrl = user?.avatarUrl ?? null;

  const summaryParts = [savedProfile.department, savedProfile.institution].filter(Boolean);
  const profileSummary =
      summaryParts.length > 0
          ? summaryParts.join(" · ")
          : "Department and institution will appear here after you save your profile.";

  function handleTabChange(tab: ProfileTabId) {
    setSearchParams({ tab });
  }

  return (
      <div className="min-h-screen bg-[#FFFEFC]">
        <div className="mx-auto max-w-345 px-5 py-8 lg:px-8">
          <div className="space-y-6">
            <div className="space-y-6">
              <div className="mb-6">
                <h1 className="text-4xl font-extrabold text-black font-title md:text-5xl">
                  Profile &amp; Settings
                </h1>
              </div>

              <div className="overflow-hidden rounded-[5px] border border-black bg-white">
                <div className="grid min-h-80 grid-rows-2">
                  <div className="relative bg-[linear-gradient(135deg,rgba(242,114,41,0.14),rgba(47,128,237,0.12),rgba(123,191,67,0.10))]">
                    <div className="absolute left-8 right-8 top-8 flex items-start justify-between md:top-10">
                      <h2 className="text-left text-3xl font-bold text-black font-title md:text-5xl">
                        {fullName}
                      </h2>
                    </div>
                  </div>

                  <div className="relative bg-white px-8 pt-6">
                    <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2">
                      <Avatar firstName={firstName} lastName={lastName} avatarUrl={avatarUrl} />
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

            <StatsRow data={stats} />

            <div className="flex flex-col gap-5 lg:flex-row lg:items-start">
              <SettingsNav active={activeTab} onChange={handleTabChange} />

              <section className="min-w-0 flex-1 rounded-4xl border border-black bg-white p-6 shadow-[10px_10px_0_0_rgba(0,0,0,0.04)]">
                {activeTab === "profile" ? (
                    isLoading ? (
                        <p className="text-sm text-black/50">Loading profile…</p>
                    ) : (
                        // key buộc remount khi data /me về, đảm bảo form luôn khởi tạo đúng giá trị mới nhất
                        <ProfileTab
                            key={`${savedProfile.email}-${savedProfile.institution}`}
                            savedProfile={savedProfile}
                            onSaved={setSavedProfile}
                        />
                    )
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
import { useState} from "react";
// import {useRef, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { getCurrentUser } from "@/features/auth/utils/authStorage";
import ChangePasswordPage from "@/features/profile/components/ChangePasswordPage.tsx";

// ─── Types ────────────────────────────────────────────────────────────────────

type TabId = "profile" | "interests" | "security";

// ─── Mock / placeholder data (replace with real API calls later) ──────────────

const MOCK_STATS = [
    { label: "FOLLOWED TOPICS", value: "12" },
    { label: "FOLLOWED AUTHORS", value: "31" },
    { label: "BOOKMARKED PAPERS", value: "184" },
    { label: "REPORTS CREATED", value: "7" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Breadcrumb strip at the very top of the content area */
// eslint-disable-next-line no-empty-pattern
function TopBar({ }: { tab: TabId }) {
    // const label: Record<TabId, string> = {
    //     profile: "Profile",
    //     interests: "Research Interests",
    //     security: "Security",
    // };
    return (
        <div className="flex items-center justify-between border-b border-slate-200 px-8 h-14 shrink-0 bg-white">
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M12 8h.01M12 12v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <span>Account</span>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M4 2l4 4-4 4" stroke="#94a3b8" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="text-slate-800 font-medium">Profile &amp; Settings</span>
            </div>

            <div className="flex items-center gap-4">
                {/* Autosave indicator */}
                <span className="flex items-center gap-1.5 text-xs text-emerald-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="1.4" />
            <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          All changes saved
        </span>

                {/* Jump to setting search */}
                <div className="flex items-center gap-2 h-8 px-3 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-400 w-48">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                        <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    Jump to a setting…
                </div>
            </div>
        </div>
    );
}

/** Avatar with initials + camera overlay */
function Avatar({ firstName, lastName }: { firstName: string; lastName: string }) {
    const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
    return (
        <div className="relative shrink-0">
            <div
                className="w-22 h-22 rounded-2xl flex items-center justify-center text-2xl font-bold text-white select-none shadow-lg"
                style={{ background: "linear-gradient(135deg, #0ea5e9 0%, #059669 100%)" }}
            >
                {initials}
            </div>
            {/* Camera button */}
            <button className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-slate-800 border-2 border-white flex items-center justify-center hover:bg-slate-700 transition-colors shadow-md">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="white" strokeWidth="1.6" strokeLinejoin="round" />
                    <circle cx="12" cy="13" r="4" stroke="white" strokeWidth="1.6" />
                </svg>
            </button>
        </div>
    );
}

/** Horizontal stats row */
function StatsRow() {
    return (
        <div className="grid grid-cols-4 gap-3 mb-6">
            {MOCK_STATS.map((s) => (
                <div key={s.label} className="rounded-xl border border-slate-200 bg-white px-4 py-3">
                    <p className="text-[10px] tracking-widest text-slate-400 uppercase mb-1">{s.label}</p>
                    <p className="text-2xl font-semibold text-slate-900">{s.value}</p>
                </div>
            ))}
        </div>
    );
}

/** Left settings nav */
function SettingsNav({ active, onChange }: { active: TabId; onChange: (t: TabId) => void }) {
    const tabs: { id: TabId; label: string; sub: string; icon: React.ReactNode }[] = [
        {
            id: "profile",
            label: "Profile",
            sub: "Name, affiliation, bio",
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            id: "interests",
            label: "Research Interests",
            sub: "Topics, authors",
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11 8v3l2 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
        {
            id: "security",
            label: "Security",
            sub: "Password",
            icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            ),
        },
    ];

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-3 w-55 shrink-0">
            <p className="text-[10px] tracking-[0.18em] text-slate-400 uppercase px-2 pt-1 pb-2 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                Settings
            </p>
            <nav className="space-y-0.5">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => onChange(t.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all ${
                            active === t.id
                                ? "bg-emerald-50 text-emerald-800"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-800"
                        }`}
                    >
            <span className={active === t.id ? "text-emerald-600" : "text-slate-400"}>
              {t.icon}
            </span>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium leading-none truncate">{t.label}</p>
                            <p className={`text-[11px] mt-0.5 truncate ${active === t.id ? "text-emerald-500/70" : "text-slate-400"}`}>
                                {t.sub}
                            </p>
                        </div>
                        {/* Active indicator dot */}
                        {active === t.id && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                        )}
                    </button>
                ))}
            </nav>
        </div>
    );
}

// ─── Tab Panels ───────────────────────────────────────────────────────────────

/** Profile tab — Personal information form */
function ProfileTab({ user }: { user: ReturnType<typeof getCurrentUser> }) {
    const [form, setForm] = useState({
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
        email: user?.email ?? "",
        languages: "English, Vietnamese",
        affiliation: "Stanford University",
        department: "Computer Science",
        bio: "",
    });
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    function set(field: keyof typeof form) {
        return (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            setForm((prev) => ({ ...prev, [field]: e.target.value }));
            setDirty(true);
            setSaved(false);
        };
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        // TODO: call updateProfile API
        await new Promise((r) => setTimeout(r, 800));
        setSaving(false);
        setDirty(false);
        setSaved(true);
    }

    function handleDiscard() {
        setForm({
            firstName: user?.firstName ?? "",
            lastName: user?.lastName ?? "",
            email: user?.email ?? "",
            languages: "English, Vietnamese",
            affiliation: "Stanford University",
            department: "Computer Science",
            bio: "",
        });
        setDirty(false);
        setSaved(false);
    }

    const inputClass =
        "w-full h-11 px-4 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white";

    return (
        <div className="flex-1">
            <h2 className="text-lg font-semibold text-slate-900 mb-1">Personal information</h2>
            <p className="text-sm text-slate-500 mb-6">
                Used on your public profile and in citations exported from this account.
            </p>

            <form onSubmit={handleSave} className="space-y-5">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            First name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.firstName}
                            onChange={set("firstName")}
                            placeholder="Mariana"
                            required
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Last name <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="text"
                            value={form.lastName}
                            onChange={set("lastName")}
                            placeholder="Velasquez"
                            required
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Email + Languages row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Email <span className="text-red-400">*</span>
                        </label>
                        <input
                            type="email"
                            value={form.email}
                            onChange={set("email")}
                            placeholder="m.velasquez@stanford.edu"
                            required
                            className={inputClass}
                        />
                        <p className="mt-1.5 text-xs text-slate-400">Used for sign-in and trend alerts.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Languages</label>
                        <input
                            type="text"
                            value={form.languages}
                            onChange={set("languages")}
                            placeholder="English, Vietnamese"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Affiliation + Department row */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Affiliation</label>
                        <input
                            type="text"
                            value={form.affiliation}
                            onChange={set("affiliation")}
                            placeholder="Stanford University"
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
                        <input
                            type="text"
                            value={form.department}
                            onChange={set("department")}
                            placeholder="Computer Science"
                            className={inputClass}
                        />
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Bio <span className="text-xs font-normal text-slate-400">(optional)</span>
                    </label>
                    <textarea
                        value={form.bio}
                        onChange={set("bio")}
                        placeholder="Brief academic bio shown on your public profile…"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all bg-white resize-none"
                    />
                    <p className="mt-1 text-right text-xs text-slate-400">{form.bio.length} / 500</p>
                </div>

                {/* Account status row */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-xl border border-slate-200 px-4 py-3">
                        <p className="text-[10px] tracking-widest text-slate-400 uppercase mb-1">Account type</p>
                        <p className="text-sm font-medium text-slate-800">
                            {user?.role === "ADMIN" ? "Administrator" : user?.role ?? "Researcher"}
                        </p>
                    </div>
                    <div className="rounded-xl border border-slate-200 px-4 py-3">
                        <p className="text-[10px] tracking-widest text-slate-400 uppercase mb-1">Member since</p>
                        <p className="text-sm font-medium text-slate-800">January 2024</p>
                    </div>
                </div>

                {/* Action bar */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                        {saving && (
                            <>
                                <svg className="animate-spin w-3.5 h-3.5 text-emerald-500" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                <span className="text-emerald-600">Saving…</span>
                            </>
                        )}
                        {saved && !saving && (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="10" stroke="#059669" strokeWidth="1.5" />
                                    <path d="M8 12l3 3 5-5" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <span className="text-emerald-600">Autosave on — last saved a few seconds ago.</span>
                            </>
                        )}
                        {!saving && !saved && dirty && (
                            <span className="text-amber-500">Unsaved changes</span>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        {dirty && (
                            <button
                                type="button"
                                onClick={handleDiscard}
                                className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                            >
                                Discard changes
                            </button>
                        )}
                        <button
                            type="submit"
                            disabled={saving || !dirty}
                            className="flex items-center gap-2 h-10 px-5 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {saving ? (
                                <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                            ) : (
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                            Save changes
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}

/** Research Interests tab — placeholder */
function InterestsTab() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="#94a3b8" strokeWidth="1.5" />
                    <path d="M21 21l-4.35-4.35" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M11 8v3l2 1" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
            </div>
            <h3 className="font-serif text-xl text-slate-700 mb-2">Research Interests</h3>
            <p className="text-sm text-slate-400 max-w-xs leading-relaxed">
                Manage the topics and authors you follow to personalise your research feed. Coming soon.
            </p>
        </div>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
    const [searchParams, setSearchParams] = useSearchParams();

    const rawTab = searchParams.get("tab");
    const activeTab: TabId =
        rawTab === "interests" || rawTab === "security" ? rawTab : "profile";

    const user = getCurrentUser();

    const firstName = user?.firstName ?? "Mariana";
    const lastName = user?.lastName ?? "Velasquez";
    const fullName = user?.fullName ?? `${firstName} ${lastName}`;
    const role = user?.role ?? "RESEARCHER";

    // Role display string
    const roleLabel: Record<string, string> = {
        RESEARCHER: "PhD Researcher",
        LECTURER: "Lecturer",
        STUDENT: "Student",
        ADMIN: "Administrator",
    };

    function handleTabChange(tab: TabId) {
        setSearchParams({ tab });
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* ── Top breadcrumb bar ── */}
            <TopBar tab={activeTab} />

            {/* ── Scrollable content area ── */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-275 mx-auto px-8 py-8 space-y-6">

                    {/* ── Section header ── */}
                    <div>
                        <p className="text-[11px] tracking-[0.18em] text-slate-400 uppercase mb-2 flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                            Account
                        </p>
                        <h1 className="font-serif text-[2.2rem] leading-tight text-slate-950">
                            Profile &amp; <span className="italic text-emerald-700">Settings</span>
                        </h1>
                        <p className="text-sm text-slate-500 mt-2 max-w-xl">
                            Manage your account, fine-tune what Research Trend Tracker watches for you, and control where alerts arrive.
                        </p>
                    </div>

                    {/* ── Profile hero card ── */}
                    <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                        {/* Banner gradient */}
                        <div
                            className="h-28 w-full"
                            style={{
                                background:
                                    "linear-gradient(110deg, #059669 0%, #0ea5e9 60%, #3b82f6 100%)",
                            }}
                        />

                        {/* Avatar + name row */}
                        <div className="px-7 pb-5 relative">
                            <div className="-mt-11 flex items-end gap-5">
                                <Avatar firstName={firstName} lastName={lastName} />
                                <div className="pb-1">
                                    <h2 className="text-xl font-semibold text-slate-900">{fullName}</h2>
                                    <p className="text-sm text-slate-500 mt-0.5">
                                        {roleLabel[role] ?? role} · Stanford University · Computer Science
                                    </p>
                                </div>
                                <button className="ml-auto mb-1 flex items-center gap-1.5 h-9 px-4 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                    View public profile
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── Stats row ── */}
                    <StatsRow />

                    {/* ── Settings layout: sidebar + content ── */}
                    <div className="flex gap-5 items-start">
                        {/* Sidebar nav */}
                        <SettingsNav active={activeTab} onChange={handleTabChange} />

                        {/* Content panel */}
                        <div className="flex-1 min-w-0 rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                            {activeTab === "profile" && <ProfileTab user={user} />}
                            {activeTab === "interests" && <InterestsTab />}
                            {activeTab === "security" && <ChangePasswordPage />}
                        </div>
                    </div>

                    {/* Bottom spacer */}
                    <div className="h-8" />
                </div>
            </div>
        </div>
    );
}

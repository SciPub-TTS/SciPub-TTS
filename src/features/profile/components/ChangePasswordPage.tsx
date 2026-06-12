import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/app/router";
import {submitChangePassword} from "@/features/auth/services/authFlows";
import {getApiErrorMessage} from "@/features/auth/utils/getApiErrorMessage";

/**
 * ChangePasswordPage
 *
 * Đặt trong pages/profile/ChangePasswordPage.tsx
 * Render bên trong ProfilePage (tab Security) hoặc route /profile/security.
 * Không có layout wrapper — layout được inject từ route cha (MainLayout / ProfileLayout).
 */

function EyeIcon({open}: { open: boolean }) {
    return open ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
                d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
    );
}

interface FieldProps {
    label: string;
    value: string;
    show: boolean;
    placeholder: string;
    onChange: (v: string) => void;
    onToggleShow: () => void;
    hint?: string;
}

function PasswordField({label, value, show, placeholder, onChange, onToggleShow, hint}: FieldProps) {
    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
            <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <LockIcon/>
        </span>
                <input
                    type={show ? "text" : "password"}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    required
                    className="w-full h-11 pl-9 pr-10 rounded-lg border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
                <button
                    type="button"
                    onClick={onToggleShow}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                    <EyeIcon open={show}/>
                </button>
            </div>
            {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
        </div>
    );
}

export default function ChangePasswordPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmNewPassword: "",
    });
    const [show, setShow] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    function set(field: keyof typeof form) {
        return (value: string) => setForm((prev) => ({...prev, [field]: value}));
    }

    function toggleShow(field: keyof typeof show) {
        setShow((prev) => ({...prev, [field]: !prev[field]}));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (form.newPassword.length < 10) {
            setError("Mật khẩu mới phải có ít nhất 10 ký tự.");
            return;
        }
        if (form.newPassword !== form.confirmNewPassword) {
            setError("Mật khẩu xác nhận không khớp.");
            return;
        }
        if (form.newPassword === form.currentPassword) {
            setError("Mật khẩu mới phải khác mật khẩu hiện tại.");
            return;
        }

        try {
            setSubmitting(true);
            setError("");

            const response = await submitChangePassword({
                currentPassword: form.currentPassword,
                newPassword: form.newPassword,
                confirmNewPassword: form.confirmNewPassword,
            });

            navigate(ROUTES.LOGIN, {
                replace: true,
                state: {
                    successMessage:
                        response.message ??
                        "Mật khẩu đã được thay đổi. Vui lòng đăng nhập lại.",
                },
            });
        } catch (err) {
            setError(getApiErrorMessage(err, "Đổi mật khẩu thất bại. Vui lòng thử lại."));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        /*
         * Wrapper ngoài cùng không có padding — padding do layout cha inject.
         * Nếu dùng standalone route, bọc ngoài bằng <ProfileLayout> hoặc <MainLayout>.
         */
        <div className="max-w-2xl">
            {/* Section header */}
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Security</h2>
                <p className="text-sm text-slate-500 mt-1">
                    Change your account password. After saving, you'll be signed out and asked to sign in again.
                </p>
            </div>

            {error && (
                <div
                    className="mb-5 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-start gap-2.5">
                    <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"/>
                        <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round"/>
                        <circle cx="12" cy="16.5" r="1.2" fill="#ef4444"/>
                    </svg>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
                {/* Current password */}
                <PasswordField
                    label="Current password"
                    value={form.currentPassword}
                    show={show.current}
                    placeholder="Enter your current password"
                    onChange={set("currentPassword")}
                    onToggleShow={() => toggleShow("current")}
                />

                {/* Divider */}
                <div className="h-px bg-slate-100"/>

                {/* New password */}
                <PasswordField
                    label="New password"
                    value={form.newPassword}
                    show={show.new}
                    placeholder="At least 10 characters"
                    onChange={set("newPassword")}
                    onToggleShow={() => toggleShow("new")}
                />

                {/* Strength meter */}
                {form.newPassword.length > 0 && (
                    <div className="-mt-2 space-y-2">
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full rounded-full transition-all duration-500`}/>
                            </div>
                            <span className="text-xs text-slate-500 w-16 text-right"></span>
                        </div>
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                                <span
                                    className={`text-xs flex items-center gap-1.5 `}
                                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  </svg>
                </span>
                        </div>
                    </div>
                )}

                {/* Confirm new password */}
                <PasswordField
                    label="Confirm new password"
                    value={form.confirmNewPassword}
                    show={show.confirm}
                    placeholder="Re-enter new password"
                    onChange={set("confirmNewPassword")}
                    onToggleShow={() => toggleShow("confirm")}
                    hint={
                        form.confirmNewPassword && form.confirmNewPassword !== form.newPassword
                            ? undefined
                            : undefined
                    }
                />

                {form.confirmNewPassword && form.confirmNewPassword !== form.newPassword && (
                    <p className="-mt-3 text-xs text-red-500">Passwords don't match.</p>
                )}

                {/* Security notice */}
                <div className="rounded-lg bg-amber-50 border border-amber-200 px-4 py-3 flex gap-2.5">
                    <svg className="shrink-0 mt-0.5" width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
                              stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round"/>
                    </svg>
                    <p className="text-xs text-amber-700 leading-relaxed">
                        After changing your password, you'll be automatically signed out of all devices and need to sign
                        in again.
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <button
                        type="button"
                        onClick={() => setForm({currentPassword: "", newPassword: "", confirmNewPassword: ""})}
                        className="text-sm text-slate-500 hover:text-slate-700 transition-colors"
                    >
                        Discard changes
                    </button>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex items-center gap-2 h-10 px-5 rounded-lg bg-emerald-800 text-white text-sm font-semibold hover:bg-emerald-900 disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    >
                        {submitting ? (
                            <>
                                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                            strokeWidth="3"/>
                                    <path className="opacity-75" fill="currentColor"
                                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                                </svg>
                                Saving…
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                                Save changes
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}

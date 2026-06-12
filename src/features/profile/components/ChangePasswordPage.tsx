import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ROUTES } from "@/app/router";
import { submitChangePassword } from "@/features/auth/services/authFlows";
import { getApiErrorMessage } from "@/features/auth/utils/getApiErrorMessage";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="1"
        y1="1"
        x2="23"
        y2="23"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="11"
        width="18"
        height="11"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M7 11V7a5 5 0 0110 0v4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

interface FieldProps {
  label: string;
  value: string;
  show: boolean;
  placeholder: string;
  onChange: (value: string) => void;
  onToggleShow: () => void;
}

function PasswordField({
  label,
  value,
  show,
  placeholder,
  onChange,
  onToggleShow,
}: FieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <LockIcon />
        </span>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
          }}
          placeholder={placeholder}
          required
          className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition-colors hover:text-slate-600"
        >
          <EyeIcon open={show} />
        </button>
      </div>
    </div>
  );
}

export default function ChangePasswordPage() {
  const navigate = useNavigate();
  //
  // const currentUser = getCurrentUser();
  // const hasPassword = currentUser?.hasPassword ?? true;
  // const isGoogleOnly = Boolean(currentUser?.googleLinked) && !hasPassword;
  const hasPassword = true;
  const isGoogleOnly = false;

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function setField(field: keyof typeof form) {
    return (value: string) => {
      setForm((previous) => ({ ...previous, [field]: value }));
    };
  }

  function toggleShow(field: keyof typeof show) {
    setShow((previous) => ({ ...previous, [field]: !previous[field] }));
  }

  const newPassword = form.newPassword;
  const checks = {
    length: newPassword.length >= 10,
    upper: /[A-Z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
    special: /[^a-zA-Z0-9]/.test(newPassword),
  };
  const strength = Object.values(checks).filter(Boolean).length;
  const strengthLabel =
    ["", "Too weak", "Weak", "Medium", "Strong"][strength] ?? "";
  const strengthColor =
    ["", "bg-red-400", "bg-orange-400", "bg-amber-400", "bg-emerald-500"][
      strength
    ] ?? "";
  const strengthWidth =
    ["w-0", "w-1/4", "w-2/4", "w-3/4", "w-full"][strength] ?? "w-0";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!hasPassword && !form.newPassword.trim()) {
      setError("Please enter a password.");
      return;
    }

    if (form.newPassword.length < 10) {
      setError("The new password must be at least 10 characters long.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    if (hasPassword && form.newPassword === form.currentPassword) {
      setError(
        "The new password must be different from your current password.",
      );
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
            "Password updated successfully. Please sign in again.",
        },
      });
    } catch (err) {
      setError(
        getApiErrorMessage(
          err,
          "Unable to update your password. Please try again.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  }

  const title = hasPassword ? "Security" : "Set a password";
  const description = hasPassword
    ? "Change your account password. After saving, you will be signed out and asked to sign in again."
    : "Your account currently signs in with Google only. Set a password if you also want to sign in with email and password.";
  const submitLabel = hasPassword ? "Save changes" : "Set password";

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      {error ? (
        <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg
            className="mt-0.5 shrink-0"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
            <path
              d="M12 8v5"
              stroke="#ef4444"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <circle cx="12" cy="16.5" r="1.2" fill="#ef4444" />
          </svg>
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="space-y-5">
        {hasPassword ? (
          <PasswordField
            label="Current password"
            value={form.currentPassword}
            show={show.current}
            placeholder="Enter your current password"
            onChange={setField("currentPassword")}
            onToggleShow={() => toggleShow("current")}
          />
        ) : null}

        {hasPassword ? <div className="h-px bg-slate-100" /> : null}

        {isGoogleOnly ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Once you set a password, you can sign in with either Google or your
            email and password.
          </div>
        ) : null}

        <PasswordField
          label={hasPassword ? "New password" : "Password"}
          value={form.newPassword}
          show={show.next}
          placeholder="At least 10 characters"
          onChange={setField("newPassword")}
          onToggleShow={() => toggleShow("next")}
        />

        {form.newPassword.length > 0 ? (
          <div className="-mt-2 space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${strengthColor} ${strengthWidth}`}
                />
              </div>
              <span className="w-16 text-right text-xs text-slate-500">
                {strengthLabel}
              </span>
            </div>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {[
                { label: "10+ characters", ok: checks.length },
                { label: "Uppercase letter", ok: checks.upper },
                { label: "Number", ok: checks.number },
                { label: "Special character", ok: checks.special },
              ].map((check) => (
                <span
                  key={check.label}
                  className={`flex items-center gap-1.5 text-xs ${check.ok ? "text-emerald-600" : "text-slate-400"}`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    {check.ok ? (
                      <>
                        <circle cx="6" cy="6" r="5.5" fill="#059669" />
                        <path
                          d="M3.5 6l2 2 3-3"
                          stroke="white"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </>
                    ) : (
                      <circle
                        cx="6"
                        cy="6"
                        r="5.5"
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                    )}
                  </svg>
                  {check.label}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        <PasswordField
          label="Confirm password"
          value={form.confirmNewPassword}
          show={show.confirm}
          placeholder="Re-enter your password"
          onChange={setField("confirmNewPassword")}
          onToggleShow={() => toggleShow("confirm")}
        />

        {form.confirmNewPassword &&
        form.confirmNewPassword !== form.newPassword ? (
          <p className="-mt-3 text-xs text-red-500">Passwords do not match.</p>
        ) : null}

        <div className="flex gap-2.5 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
          <svg
            className="mt-0.5 shrink-0"
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#d97706"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line
              x1="12"
              y1="9"
              x2="12"
              y2="13"
              stroke="#d97706"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="17"
              x2="12.01"
              y2="17"
              stroke="#d97706"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-xs leading-relaxed text-amber-700">
            After saving, you will be signed out on this device and any other
            active sessions will be revoked.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={() => {
              setForm({
                currentPassword: "",
                newPassword: "",
                confirmNewPassword: "",
              });
            }}
            className="text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            Discard changes
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-10 items-center gap-2 rounded-lg bg-emerald-800 px-5 text-sm font-semibold text-white transition-all hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg
                  className="animate-spin"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="3"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="white"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

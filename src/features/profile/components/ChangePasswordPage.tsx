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
      <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
      <label className="font-subtext mb-1.5 block text-sm font-medium text-slate-700">
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
          className="h-11 w-full rounded-xl border border-slate-200/90 bg-white pl-9 pr-10 text-sm text-slate-900 placeholder-slate-400 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-all focus:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
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
  // Temporarily keep the old "change password only" behavior
  // while login/register is being tested in isolation.
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

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!hasPassword && !form.newPassword.trim()) {
      setError("Please enter a password.");
      return;
    }

    if (form.newPassword !== form.confirmNewPassword) {
      setError("Password confirmation does not match.");
      return;
    }

    if (hasPassword && form.newPassword === form.currentPassword) {
      setError("The new password must be different from your current password.");
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
        getApiErrorMessage(err, "Unable to update your password. Please try again."),
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
      <div className="mb-6 border-b border-slate-100 pb-5">
        <p className="font-subtext mb-2 flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-emerald-600">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Account Security
        </p>
        <h2 className="font-title text-[1.95rem] leading-tight text-slate-950">{title}</h2>
        <p className="font-subtext mt-2 max-w-xl text-sm leading-relaxed text-slate-500">
          {description}
        </p>
      </div>

      {error ? (
        <div className="font-subtext mb-5 flex items-start gap-2.5 rounded-xl border border-red-200 bg-red-50/90 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M12 8v5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
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
          <div className="font-subtext rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-800">
            Once you set a password, you can sign in with either Google or your email and password.
          </div>
        ) : null}

        <PasswordField
          label={hasPassword ? "New password" : "Password"}
          value={form.newPassword}
          show={show.next}
          placeholder="Enter new password"
          onChange={setField("newPassword")}
          onToggleShow={() => toggleShow("next")}
        />

        <PasswordField
          label="Confirm password"
          value={form.confirmNewPassword}
          show={show.confirm}
          placeholder="Re-enter your password"
          onChange={setField("confirmNewPassword")}
          onToggleShow={() => toggleShow("confirm")}
        />

        {form.confirmNewPassword && form.confirmNewPassword !== form.newPassword ? (
          <p className="font-subtext -mt-3 text-xs text-red-500">Passwords do not match.</p>
        ) : null}

        <div className="flex gap-2.5 rounded-xl border border-sky-100 bg-sky-50/80 px-4 py-3">
          <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path
              d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="#0284c7"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <line x1="12" y1="9" x2="12" y2="13" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="12" y1="17" x2="12.01" y2="17" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <p className="font-subtext text-xs leading-relaxed text-sky-800">
            After saving, you will be signed out on this device and any other active sessions will be revoked.
          </p>
        </div>

        <div className="flex items-center justify-between border-t border-slate-100 pt-2">
          <button
            type="button"
            onClick={() => {
              setForm({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
            }}
            className="font-subtext text-sm text-slate-500 transition-colors hover:text-slate-700"
          >
            Discard changes
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="flex h-10 items-center gap-2 rounded-xl bg-emerald-800 px-5 text-sm font-semibold text-white shadow-[0_10px_24px_rgba(5,150,105,0.16)] transition-all hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>
                <svg className="animate-spin" width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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

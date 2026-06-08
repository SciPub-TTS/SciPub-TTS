import { Link } from "react-router-dom";

import { ROUTES } from "@/app/router";
import AuthMessage from "@/features/auth/components/common/AuthMessage";
import GoogleLoginButton from "@/features/auth/components/common/GoogleLoginButton";
import PasswordInput from "@/features/auth/components/form/PasswordInput";
import PasswordStrength from "@/features/auth/components/form/PasswordStrength";

type RegisterFormState = {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type RegisterFormPanelProps = {
    form: RegisterFormState;
    error: string;
    submitting: boolean;
    onChange: (field: keyof RegisterFormState, value: string) => void;
    onSubmit: (event: React.FormEvent) => void;
    onGoogleLogin: () => void;
};

export default function RegisterFormPanel({
  form,
  error,
  submitting,
  onChange,
  onSubmit,
  onGoogleLogin,
}: RegisterFormPanelProps) {
    return (
        <section className="flex min-h-full items-center justify-center bg-white px-8 py-10">
            <div className="w-full max-w-140">
                <div className="mb-7">
                    

                    <h1 className="font-serif text-[2.4rem] leading-[1.12] text-slate-950">
                        Start tracking the field
                    </h1>

                    <h1 className="mb-3 font-serif text-[2.4rem] italic leading-[1.12] text-emerald-700">
                        before it moves.
                    </h1>

                    
                </div>

                <AuthMessage type="error" message={error} />

                <GoogleLoginButton onClick={onGoogleLogin} />

                <div className="relative mb-5 flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-100" />
                    <span className="text-[11px] uppercase tracking-widest text-slate-400">
            or with email
          </span>
                    <div className="h-px flex-1 bg-slate-100" />
                </div>

                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <TextInput
                            label="First name"
                            value={form.firstName}
                            onChange={(value) => onChange("firstName", value)}
                            placeholder="Mariana"
                        />

                        <TextInput
                            label="Last name"
                            value={form.lastName}
                            onChange={(value) => onChange("lastName", value)}
                            placeholder="Velasquez"
                        />
                    </div>

                    <TextInput
                        label="Email"
                        type="email"
                        value={form.email}
                        onChange={(value) => onChange("email", value)}
                        placeholder="your.email@university.edu"
                    />

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <PasswordInput
                                label="Password"
                                value={form.password}
                                onChange={(value) => onChange("password", value)}
                                placeholder="At least 10 characters"
                            />
                            <PasswordStrength password={form.password} />
                        </div>

                        <PasswordInput
                            label="Confirm password"
                            value={form.confirmPassword}
                            onChange={(value) => onChange("confirmPassword", value)}
                            placeholder="Re-enter password"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-800 text-sm font-semibold text-white transition-all hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {submitting ? (
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
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
                        ) : (
                            <>
                                Create account & build my feed →
                            </>
                        )}
                    </button>
                </form>

                <p className="mt-5 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <Link
                        to={ROUTES.LOGIN}
                        className="font-medium text-emerald-700 hover:underline"
                    >
                        Login
                    </Link>
                </p>
            </div>
        </section>
    );
}

type TextInputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    type?: string;
};

function TextInput({
                       label,
                       value,
                       onChange,
                       placeholder,
                       type = "text",
                   }: TextInputProps) {
    return (
        <div>
            <label className="mb-1.5 block text-sm font-medium text-slate-700">
                {label}
            </label>

            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                >
                    {type === "email" ? (
                        <>
                            <path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M22 6l-10 7L2 6"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                        </>
                    ) : (
                        <>
                            <circle
                                cx="12"
                                cy="8"
                                r="4"
                                stroke="currentColor"
                                strokeWidth="1.5"
                            />
                            <path
                                d="M4 20c0-4 3.6-7 8-7s8 3 8 7"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                            />
                        </>
                    )}
                </svg>

                <input
                    type={type}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    required
                    className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
        </div>
    );
}
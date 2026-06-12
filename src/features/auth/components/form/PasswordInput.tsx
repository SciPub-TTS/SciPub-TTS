import { useState } from "react";

type PasswordInputProps = {
    label: string;
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    showStrength?: boolean;
};

export default function PasswordInput({
    label,
    value,
    onChange,
    placeholder = "At least 10 characters",
}: PasswordInputProps) {
    const [visible, setVisible] = useState(false);

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

                <input
                    type={visible ? "text" : "password"}
                    value={value}
                    onChange={(event) => onChange(event.target.value)}
                    placeholder={placeholder}
                    required
                    minLength={10}
                    className="h-11 w-full rounded-lg border border-slate-200 pl-9 pr-8 text-sm text-slate-900 placeholder-slate-400 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />

                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                    aria-label={visible ? "Hide password" : "Show password"}
                >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                        <circle
                            cx="12"
                            cy="12"
                            r="3"
                            stroke="currentColor"
                            strokeWidth="1.5"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
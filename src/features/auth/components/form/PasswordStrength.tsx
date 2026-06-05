type PasswordStrengthProps = {
    password: string;
};

export default function PasswordStrength({ password }: PasswordStrengthProps) {
    if (!password) return null;

    const strength =
        password.length >= 10 && /[A-Z]/.test(password) && /[0-9]/.test(password)
            ? "strong"
            : password.length >= 10
                ? "medium"
                : "weak";

    const colors = {
        weak: "bg-red-400",
        medium: "bg-amber-400",
        strong: "bg-emerald-500",
    };

    const labels = {
        weak: "Too weak",
        medium: "Medium",
        strong: "Strong",
    };

    const widths = {
        weak: "w-1/3",
        medium: "w-2/3",
        strong: "w-full",
    };

    return (
        <div className="mt-1.5 flex items-center gap-2">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-slate-100">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${colors[strength]} ${widths[strength]}`}
                />
            </div>

            <span className="text-[10px] uppercase tracking-wide text-slate-400">
        {labels[strength]}
      </span>
        </div>
    );
}
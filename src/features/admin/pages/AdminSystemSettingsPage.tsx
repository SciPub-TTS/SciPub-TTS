import { useEffect, useState } from "react";

import { useAdminSystemSettingsPage } from "@/features/admin/hooks";
import type {
  AdminCronConfig,
  AdminCronConfigUpdateInput,
} from "@/features/admin/types";

const cronFieldLabels: Array<{
  key: keyof AdminCronConfigUpdateInput;
  label: string;
}> = [
  { key: "second", label: "Second" },
  { key: "minute", label: "Minute" },
  { key: "hour", label: "Hour" },
  { key: "dayOfMonth", label: "Day of Month" },
  { key: "month", label: "Month" },
  { key: "dayOfWeek", label: "Day of Week" },
];

const dayOfWeekOptions = [
  { label: "Every day", value: "*" },
  { label: "Monday", value: "MON" },
  { label: "Tuesday", value: "TUE" },
  { label: "Wednesday", value: "WED" },
  { label: "Thursday", value: "THU" },
  { label: "Friday", value: "FRI" },
  { label: "Saturday", value: "SAT" },
  { label: "Sunday", value: "SUN" },
];

export default function AdminSystemSettingsPage() {
  const [editingConfig, setEditingConfig] = useState<AdminCronConfig | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const {
    cronConfigErrorMessage,
    cronConfigs,
    handleUpdateCronConfig,
    isLoadingCronConfigs,
    isUpdatingCronConfig,
    updateCronConfigErrorMessage,
    updatingCronConfigKey,
  } = useAdminSystemSettingsPage();

  useEffect(() => {
    if (!successMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 4000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [successMessage]);

  return (
    <section className="space-y-5">
      {successMessage && (
        <div className="font-subtext rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          {successMessage}
        </div>
      )}

      <article className="rounded-xl border border-black bg-white shadow-sm">
        <div className="border-b border-black p-5">
          <h2 className="font-title text-lg font-bold text-slate-950">
            Sync Schedules
          </h2>
          <p className="font-subtext mt-1 text-sm font-medium text-slate-500">
            Cron configurations that control background synchronization jobs.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1180px] border-collapse text-left">
            <thead>
              <tr className="font-subtext bg-slate-50 text-xs font-bold text-slate-500">
                <th className="px-5 py-4">STT</th>
                <th className="px-5 py-4">Config Key</th>
                <th className="px-5 py-4">Cron Expression</th>
                <th className="px-5 py-4">Created At</th>
                <th className="px-5 py-4">Updated At</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!isLoadingCronConfigs &&
                !cronConfigErrorMessage &&
                cronConfigs.map((config, index) => (
                  <tr
                    key={config.configKey}
                    className="font-subtext text-sm font-medium text-slate-700"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 font-semibold text-slate-900">
                      {formatText(config.configKey)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <code className="rounded-md bg-slate-100 px-2 py-1 text-xs font-bold text-slate-700">
                        {formatText(config.fullCronExpression)}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDateTime(config.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {formatDateTime(config.updateAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <button
                        type="button"
                        onClick={() => setEditingConfig(config)}
                        className="rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-slate-950 disabled:cursor-not-allowed disabled:bg-slate-300"
                        disabled={isUpdatingCronConfig}
                      >
                        {isUpdatingCronConfig &&
                        updatingCronConfigKey === config.configKey
                          ? "Saving..."
                          : "Edit"}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          {isLoadingCronConfigs && (
            <TableStateMessage>Loading sync schedules...</TableStateMessage>
          )}

          {!isLoadingCronConfigs && cronConfigErrorMessage && (
            <TableStateMessage tone="error">
              {cronConfigErrorMessage}
            </TableStateMessage>
          )}

          {!isLoadingCronConfigs &&
            !cronConfigErrorMessage &&
            cronConfigs.length === 0 && (
              <TableStateMessage>No sync schedules found.</TableStateMessage>
          )}
        </div>
      </article>

      {editingConfig && (
        <CronEditDialog
          config={editingConfig}
          errorMessage={updateCronConfigErrorMessage}
          isPending={isUpdatingCronConfig}
          onClose={() => {
            if (!isUpdatingCronConfig) {
              setEditingConfig(null);
            }
          }}
          onSubmit={async (payload) => {
            await handleUpdateCronConfig(editingConfig.configKey, payload);
            setSuccessMessage("Sync schedule updated successfully.");
            setEditingConfig(null);
          }}
        />
      )}
    </section>
  );
}

function CronEditDialog({
  config,
  errorMessage,
  isPending,
  onClose,
  onSubmit,
}: {
  config: AdminCronConfig;
  errorMessage: string;
  isPending: boolean;
  onClose: () => void;
  onSubmit: (payload: AdminCronConfigUpdateInput) => Promise<void>;
}) {
  const [values, setValues] = useState<AdminCronConfigUpdateInput>(() =>
    getCronUpdateInput(config),
  );
  const isFormValid = [values.second, values.minute, values.hour].every(
    (value) => value.trim(),
  );

  useEffect(() => {
    setValues(getCronUpdateInput(config));
  }, [config]);

  function handleFieldChange(
    field: keyof AdminCronConfigUpdateInput,
    value: string,
  ) {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!isFormValid || isPending) {
      return;
    }

    await onSubmit(trimCronUpdateInput(values));
  }

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4 py-6">
      <form
        onSubmit={(event) => {
          void handleSubmit(event);
        }}
        className="w-full max-w-2xl rounded-xl border border-black bg-white shadow-xl"
      >
        <div className="border-b border-black p-5">
          <h2 className="font-title text-lg font-bold text-slate-950">
            Edit Sync Schedule
          </h2>
          <p className="font-subtext mt-1 break-all text-sm font-semibold text-slate-500">
            {config.configKey}
          </p>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {cronFieldLabels.map((field) => (
            <label key={field.key} className="block">
              <span className="font-subtext text-xs font-bold uppercase text-slate-500">
                {field.label}
              </span>
              {field.key === "dayOfWeek" ? (
                <select
                  className="font-subtext mt-1 h-11 w-full rounded-xl border border-black bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                  disabled={isPending}
                  onChange={(event) =>
                    handleFieldChange(field.key, event.target.value)
                  }
                  value={values.dayOfWeek.trim() || "*"}
                >
                  {dayOfWeekOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  className="font-subtext mt-1 h-11 w-full rounded-xl border border-black bg-white px-3 text-sm font-semibold text-slate-800 outline-none transition focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                  disabled={isPending}
                  onChange={(event) =>
                    handleFieldChange(field.key, event.target.value)
                  }
                  value={values[field.key]}
                />
              )}
            </label>
          ))}
        </div>

        {errorMessage && (
          <p className="font-subtext px-5 pb-4 text-sm font-semibold text-red-600">
            {errorMessage}
          </p>
        )}

        <div className="flex justify-end gap-3 border-t border-black p-5">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="rounded-xl border border-black bg-white px-4 py-2 text-sm font-bold text-slate-800 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid || isPending}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}

function TableStateMessage({
  children,
  tone = "default",
}: {
  children: string;
  tone?: "default" | "error";
}) {
  return (
    <div
      className={[
        "font-subtext border-t border-black px-5 py-10 text-center text-sm font-medium",
        tone === "error" ? "text-red-600" : "text-slate-500",
      ].join(" ")}
    >
      {children}
    </div>
  );
}

function formatText(value: AdminCronConfig[keyof AdminCronConfig]) {
  if (typeof value !== "string" || !value.trim()) {
    return "-";
  }

  return value;
}

function formatDateTime(value: string | null) {
  if (!value?.trim()) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getCronUpdateInput(config: AdminCronConfig): AdminCronConfigUpdateInput {
  return {
    dayOfMonth: config.dayOfMonth ?? "",
    dayOfWeek: config.dayOfWeek ?? "",
    hour: config.hour ?? "",
    minute: config.minute ?? "",
    month: config.month ?? "",
    second: config.second ?? "",
  };
}

function trimCronUpdateInput(
  values: AdminCronConfigUpdateInput,
): AdminCronConfigUpdateInput {
  return {
    dayOfMonth: normalizeOptionalCronPart(values.dayOfMonth),
    dayOfWeek: normalizeOptionalCronPart(values.dayOfWeek),
    hour: values.hour.trim(),
    minute: values.minute.trim(),
    month: normalizeOptionalCronPart(values.month),
    second: values.second.trim(),
  };
}

function normalizeOptionalCronPart(value: string) {
  return value.trim() || "*";
}

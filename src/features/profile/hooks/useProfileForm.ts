import { useState } from "react";
import { submitProfileUpdate } from "@/features/profile/services/profileFlows";
import type { ProfileFormState } from "@/features/profile/types/profile.types";

export function useProfileForm(
    savedProfile: ProfileFormState,
    onSaved: (profile: ProfileFormState) => void,
) {
    const [form, setForm] = useState<ProfileFormState>({ ...savedProfile });
    const [editing, setEditing] = useState(false);
    const [dirty, setDirty] = useState(false);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    function updateField(field: keyof ProfileFormState) {
        return (value: string) => {
            setForm((prev) => ({ ...prev, [field]: value }));
            setDirty(true);
            setSaved(false);
        };
    }

    function startEdit() {
        setEditing(true);
        setSaved(false);
        setError("");
    }

    function discard() {
        setForm({ ...savedProfile });
        setEditing(false);
        setDirty(false);
        setSaved(false);
        setError("");
    }

    async function save() {
        if (!editing) return;

        setSaving(true);
        setError("");

        const result = await submitProfileUpdate(form);

        setSaving(false);

        if (result.success) {
            onSaved(form);
            setEditing(false);
            setDirty(false);
            setSaved(true);
        } else {
            setSaved(false);
            setError("Unable to save your profile. Please try again.");
        }
    }

    return {
        form,
        editing,
        dirty,
        saving,
        saved,
        error,
        updateField,
        startEdit,
        discard,
        save,
    };
}
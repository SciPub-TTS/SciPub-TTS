import { useEffect, useState } from "react";
import { fetchDashboardSummary } from "@/features/profile/services/profileFlows";
import type { StatItem } from "@/features/profile/types/profile.types";

const DEFAULT_STATS: StatItem[] = [
    {
        label: "FOLLOWED TOPICS",
        value: "0",
        accent: "from-[#FFF1E8] to-[#FFE0CC]",
        valueClass: "text-[#F27229]",
    },
    {
        label: "FOLLOWED AUTHORS",
        value: "0",
        accent: "from-[#EEF8FF] to-[#DDF0FF]",
        valueClass: "text-[#2F80ED]",
    },
    {
        label: "BOOKMARKED PAPERS",
        value: "0",
        accent: "from-[#F3FBEA] to-[#E5F6CB]",
        valueClass: "text-[#7BBF43]",
    },
];

export function useProfileSummary() {
    const [stats, setStats] = useState<StatItem[]>(DEFAULT_STATS);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function load() {
            const data = await fetchDashboardSummary();

            if (!isMounted) return;

            if (data) {
                setStats([
                    {
                        label: "FOLLOWED TOPICS",
                        value: data.followTopics.toString(),
                        accent: "from-[#FFF1E8] to-[#FFE0CC]",
                        valueClass: "text-[#F27229]",
                    },
                    {
                        label: "FOLLOWED AUTHORS",
                        value: data.followAuthors.toString(),
                        accent: "from-[#EEF8FF] to-[#DDF0FF]",
                        valueClass: "text-[#2F80ED]",
                    },
                    {
                        label: "BOOKMARKED PAPERS",
                        value: data.bookmarkMarked.toString(),
                        accent: "from-[#F3FBEA] to-[#E5F6CB]",
                        valueClass: "text-[#7BBF43]",
                    },
                ]);
            }

            setIsLoading(false);
        }

        void load();

        return () => {
            isMounted = false;
        };
    }, []);

    return { stats, isLoading };
}
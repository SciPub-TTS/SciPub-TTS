import {Link} from "react-router-dom";
import {Check} from "lucide-react";
import type {TopicData} from "@/features/dashboard/topic/types/topic.ts";
import {useTopicRanking} from "@/features/dashboard/topic/hooks/useTopicRanking.ts";
import {useEntityFollow} from "@/features/follows/hooks/useEntityFollow.ts";
import {
    buildDetailTrailUrl,
    persistRootDetailNavigation,
} from "@/features/detail/detailTrail.ts";

type TrendingPartProps = {
    startDate: string;
    endDate: string;
    fieldId: string;
    formula: string;
};


export default function TrendingPart ({
                                          startDate,
                                          endDate,
                                          fieldId,
                                          formula
                                      }: TrendingPartProps){

    const {topics} = useTopicRanking({startDate, endDate, fieldId, formula});

    return (
        <div className="rounded-lg border border-slate-200 bg-white p-4
        flex flex-col gap-2"
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-col">
                    <h1 className="text-xl font-bold text-slate-900">
                        Top Trending Topics
                    </h1>
                    <h2 className="text-sm opacity-75">
                        Ranked by trend score and growth rate
                    </h2>
                </div>
            </div>

            <div className="flex flex-col w-full">
                {topics.map((topic, id) => (
                    <Topic topic={topic} id={id}/>
                ))}
            </div>
        </div>
    );
}

const stateStyle = {
    breakout: "bg-purple-100 text-purple-700",
    hot: "bg-red-100 text-red-700",
    rising: "bg-yellow-100 text-yellow-700",
    declining: "bg-slate-100 text-slate-700"
};

function Topic({topic, id}:
               {topic:TopicData, id:number}){

    const topicId = topic.topicId.split('/').at(-1);
    const link = topicId
        ? buildDetailTrailUrl("topics", topicId, "trending")
        : "#";

    const {
        buttonLabel,
        handleFollowClick,
        isFollowActionPending,
        isFollowed,
    } = useEntityFollow({
        displayName: topic.name,
        targetOpenAlexId: topic.topicId.split("/").pop() ?? "",
        targetType: "TOPIC",
    });

    return(
        <div className={`grid grid-cols-[33%_38%_29%] justify-between border-b-1
        border-slate-200 items-center px-4 py-2 ${id === 9 ? `!border-none`: null}`}>
            <div className="flex flex-row items-center gap-6">
                <p>{id + 1}</p>

                <div className="flex flex-col text-xs">
                    <Link to={link}
                        onClick={() => {
                            if (topicId) {
                                persistRootDetailNavigation("topics", topicId, "trending");
                            }
                        }}
                        className="text-blue-700 font-semibold text-base"
                    >
                        {topic.name}
                    </Link>
                    <p className="opacity-70">{topic.works.toLocaleString()} works</p>
                    <p className="opacity-70">{topic.citations.toLocaleString()} citations</p>
                </div>
            </div>

            <div className="w-[80%]">
                <div className="flex flex-row items-center gap-1">
                    <div className="w-full h-2 bg-slate-200 rounded-full">
                        <div
                            className="h-full bg-green-600 rounded-full"
                            style={{
                                width: `${topic.score}%`
                            }}
                        />
                    </div>

                    <span>{topic.score}</span>
                </div>

                <p className="text-green-600">
                    {topic.change > 0 ? `+${topic.change}` : topic.change}%
                </p>
            </div>

            <div className="flex flex-row items-center gap-10 justify-between ml-[-2vw]">
                <div
                    className={`w-24 text-center px-3 py-1 rounded-xl text-sm font-medium capitalize
            ${stateStyle[topic.state as keyof typeof stateStyle]}
        `}
                >
                    {topic.state}
                </div>

                {isFollowed ? (
                    <button
                        className="flex flex-row items-center gap-2 font-semibold
            bg-green-100 border-2 border-green-300 text-green-800 px-2 py-1 rounded-xl
            cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                        onClick={handleFollowClick}
                        disabled={isFollowActionPending}
                    >
                        <Check/>
                        {buttonLabel}
                    </button>
                ) : (
                    <button className="bg-green-600 text-white font-bold
        py-[1vh] px-2 rounded-xl cursor-pointer w-[8vw]"
                            onClick={handleFollowClick}
                            disabled={isFollowActionPending}
                    >
                        {buttonLabel}
                    </button>
                )}
            </div>
        </div>
    );
}

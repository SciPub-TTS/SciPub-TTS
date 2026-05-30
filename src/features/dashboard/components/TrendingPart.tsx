import {LIST_TOPICS, type TopicData} from "@/features/dashboard/constants/topic-data.ts";
import {Link} from "react-router-dom";
import {Check} from "lucide-react";

export default function TrendingPart (){
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
                {LIST_TOPICS.map((topic, id) => (
                    <Topic topic={topic} id={id}/>
                ))}
            </div>
        </div>
    );
}

const stateStyle = {
    hot: "bg-red-100 text-red-700",
    breakout: "bg-purple-100 text-purple-700",
    rising: "bg-yellow-100 text-yellow-700"
};

function Topic({topic, id}:
               {topic:TopicData, id:number}){
    return(
        <div className={`grid grid-cols-[33%_47%_20%] justify-between border-b-1
        border-slate-200 items-center px-4 py-2 ${id === 9 ? `!border-none`: null}`}>
            <div className="flex flex-row items-center gap-6">
                <p>{id + 1}</p>

                <div className="flex flex-col text-sm">
                    <Link to={"https://i.ytimg.com/vi/3VkHPhNt9Os/maxresdefault.jpg"}
                        className="text-blue-700 font-semibold text-lg"
                    >
                        {topic.name}
                    </Link>
                    <p className="opacity-70">{topic.works} works</p>
                    <p className="opacity-70">{topic.citations} citations</p>
                </div>
            </div>

            <div className="w-[70%]">
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
                    +{topic.change}%
                </p>
            </div>

            <div className="flex flex-row items-center gap-4 justify-between">
                <div
                    className={`
                        px-3 py-1
                        rounded-xl
                        text-sm
                        font-medium
                        ${stateStyle[topic.state as keyof typeof stateStyle]}
                    `}
                >
                    {topic.state}
                </div>

                {topic.isFollowed ? (
                    <button className="bg-green-600 text-white font-semibold
                    py-2 px-4 rounded-xl cursor-pointer">
                        + Follow
                    </button>
                ):(
                    <div className="flex flex-row items-center gap-2 font-semibold
                    bg-green-100 border-2 border-green-300 text-green-800 px-2 py-1 rounded-xl">
                        <Check/>
                        Following
                    </div>
                )}
            </div>
        </div>
    );
}
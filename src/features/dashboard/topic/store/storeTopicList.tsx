import type {TopicMetadata} from "@/features/dashboard/topic/types/topic.ts";
import {createSlice, type PayloadAction} from "@reduxjs/toolkit";

type TopicState = {
    topicList: TopicMetadata[];
};

const initialState: TopicState = {
    topicList: [],
};

const topicSlice = createSlice({
    name: "topic",
    initialState,
    reducers: {
        setTopicList(state, action: PayloadAction<TopicMetadata[]>) {
            state.topicList = action.payload;
        },
        addTopic(state, action: PayloadAction<TopicMetadata>) {
            state.topicList.push(action.payload);
        },
    },
});

export const { setTopicList, addTopic } = topicSlice.actions;
export const topicReducer = topicSlice.reducer;
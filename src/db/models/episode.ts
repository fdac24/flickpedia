import mongoose, { Schema } from "mongoose";

export interface IEpisode {
    number: number;
    name: string;
    season: string;
    show: string;
    script: string;
}

const EpisodeSchema: Schema = new Schema({
    number: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    season: {
        type: Schema.Types.ObjectId,
        required: true
    },
    show: {
        type: Schema.Types.ObjectId,
        required: true
    },
    script: {
        type: String,
        required: true
    }
});

const Episode = mongoose.models.Episode || mongoose.model<IEpisode>('Episode', EpisodeSchema);

export default Episode;

import mongoose, { Schema } from "mongoose";

export interface ISeason {
    number: number;
    episodes: {
        id: string;
        name: string;
        number: number;
    }[];
    show: string;
}

const SeasonSchema: Schema = new Schema({
    number: {
        type: Number,
        required: true
    },
    episodes: {
        type: [
            {
                id: {
                    type: Schema.Types.ObjectId,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                number: {
                    type: Number,
                    required: true
                }
            }
        ],
        default: [] // Ensure episodes is an empty array by default
    },
    show: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

const Season = mongoose.models.Season || mongoose.model<ISeason>('Season', SeasonSchema);

export default Season;

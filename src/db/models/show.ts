import mongoose, { Schema } from "mongoose";

export interface IShow {
  name: string;
  seasons: {
    id: string;
    number: number;
  }[];
}

const ShowSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  seasons: {
    type: [
      {
        id: {
          type: Schema.Types.ObjectId,
          required: true,
        },
        number: {
          type: Number,
          required: true,
        },
      },
    ],
    default: [],
  },
});

const Show = mongoose.models.Show || mongoose.model<IShow>("Show", ShowSchema);

export default Show;

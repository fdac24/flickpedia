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
  seasons: [
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
});

const Show = mongoose.models.Show || mongoose.model<IShow>("Show", ShowSchema);

export default Show;

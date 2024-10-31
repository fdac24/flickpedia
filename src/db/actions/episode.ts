import { EpisodeModel, SeasonModel } from "../models";
import { IEpisode } from "../models/episode";
import dbConnect from "../mongoose";

export async function getEpisode(id: string) {
  await dbConnect();
  return await EpisodeModel.findById(id);
}

export async function getScripts() {
  await dbConnect();
  return await EpisodeModel.find({}, "_id script");
}

export async function createEpisode(episodeData: IEpisode) {
  await dbConnect();
  const episode = await EpisodeModel.create(episodeData);

  await SeasonModel.findByIdAndUpdate(episodeData.season, {
    $push: {
      episodes: {
        id: episode._id,
        name: episodeData.name,
        number: episodeData.number,
      },
    },
  });
}

export async function updateEpisode(id: string, episode: IEpisode) {
  await dbConnect();
  return await EpisodeModel.findByIdAndUpdate(id, episode, { new: true });
}

export async function deleteEpisode(id: string) {
  await dbConnect();
  const episode = await EpisodeModel.findById(id);

  await SeasonModel.findByIdAndUpdate(episode.season, {
    $pull: { episodes: { id: episode._id } },
  });
}

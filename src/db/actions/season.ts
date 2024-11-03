"use server";

import { EpisodeModel, SeasonModel } from "../models";
import { ISeason } from "../models/season";
import Show from "../models/show";
import dbConnect from "../mongoose";

export async function getSeason(id: string) {
  await dbConnect();
  return await SeasonModel.findById(id);
}

export async function createSeason(number: number, showId: string) {
  await dbConnect();
  const season = await SeasonModel.create({ number, show: showId, episodes: [] });

  await Show.findByIdAndUpdate(showId, {
    $push: {
      seasons: {
        id: season._id,
        number: number,
      },
    },
  });
}

export async function updateSeason(id: string, seasonData: ISeason) {
  await dbConnect();
  return await SeasonModel.findByIdAndUpdate(id, seasonData, { new: true });
}

export async function deleteSeason(id: string) {
  await dbConnect();
  const season = await SeasonModel.findById(id);

  await Show.findByIdAndUpdate(season.show, {
    $pull: {
      seasons: {
        id: season._id,
      },
    },
  });

  for (const episode of season.episodes) {
    await EpisodeModel.findByIdAndDelete(episode.id);
  }

  return await season.delete();
}

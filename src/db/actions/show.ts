"use server";

import { EpisodeModel, ShowModel } from "../models";
import { IShow } from "../models/show";
import dbConnect from "../mongoose";

export async function getShows() {
  await dbConnect();
  return await ShowModel.find();
}

export async function getShowById(id: string) {
  await dbConnect();
  return await ShowModel.findById(id);
}

export async function createShow(name: string) {
  await dbConnect();
  return await ShowModel.create({ name, seasons: [] });
}

export async function updateShow(id: string, showData: IShow) {
  await dbConnect();
  return await ShowModel.findByIdAndUpdate(id, showData, { new: true });
}

export async function deleteShow(id: string) {
  await dbConnect();
  const show = await ShowModel.findById(id);

  for (const season of show.seasons) {
    for (const episode of season.episodes) {
      await EpisodeModel.findByIdAndDelete(episode.id);
    }
    season.delete();
  }

  return await show.delete();
}

// "use server";

// import mongoose from "mongoose";
// import { EpisodeModel } from "../models";
// import dbConnect from "../mongoose";
// import { FuseResult } from "fuse.js";

// export type EpisodeInfo = {
//   _id: string;
//   episode_name: string;
//   episode_num: number;
//   show_name: string;
//   season_num: number;
//   script: string;
// };

// export async function getEpisodesInfoWithScript(
//   fuseResults: FuseResult<{ _id: string; script: string }>[]
// ) {
//   console.log(fuseResults.length)
//   if (!fuseResults.length) {
//     return [];
//   }

//   await dbConnect();

//   // Sanitize and convert IDs to ObjectId
//   const episodeIds = fuseResults
//     .map((result) => result.item._id)
//     .filter((id) => mongoose.Types.ObjectId.isValid(id))
//     .map((id) => new mongoose.Types.ObjectId(id));

//   const episodesInfo = await EpisodeModel.aggregate([
//     { $match: { _id: { $in: episodeIds } } },
//     {
//       $lookup: {
//         from: "shows",
//         localField: "show",
//         foreignField: "_id",
//         as: "show",
//       },
//     },
//     {
//       $lookup: {
//         from: "seasons",
//         localField: "season",
//         foreignField: "_id",
//         as: "season",
//       },
//     },
//     { $unwind: "$show" },
//     { $unwind: "$season" },
//     {
//       $project: {
//         _id: { $toString: "$_id" }, // Convert _id to string
//         episode_name: "$name",
//         episode_num: "$number",
//         show_name: "$show.name",
//         season_num: "$season.number",
//       },
//     },
//   ]);

//   // Enrich results with the `script` field from fuseResults
//   const enrichedResults: EpisodeInfo[] = episodesInfo.map((episode) => {
//     const originalResult = fuseResults.find(
//       (result) => result.item._id === episode._id
//     );

//     return {
//       ...episode,
//       script: originalResult?.item.script || null,
//     };
//   });

//   return enrichedResults;
// }


"use server";

import mongoose from "mongoose";
import { EpisodeModel } from "../models";
import dbConnect from "../mongoose";
import { FuseResult } from "fuse.js";

export type EpisodeInfo = {
  _id: string;
  episode_name: string;
  episode_num: number;
  show_name: string;
  season_num: number;
  script: string;
};

export async function getEpisodesInfoWithScript(
  fuseResults: FuseResult<{ _id: string; script: string }>[]
) {
  if (!fuseResults.length) {
    return [];
  }

  await dbConnect();

  // Sanitize and convert IDs to ObjectId
  const episodeIds = fuseResults
    .map((result) => result.item._id)
    .filter((id) => mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  const episodesInfo = await EpisodeModel.aggregate([
    { $match: { _id: { $in: episodeIds } } },
    {
      $lookup: {
        from: "shows",
        localField: "show",
        foreignField: "_id",
        as: "show",
      },
    },
    { $unwind: "$show" },
    {
      $project: {
        _id: { $toString: "$_id" }, // Convert _id to string
        episode_name: "$name",
        episode_num: "$number",
        show_name: "$show.name",
        season_num: { $literal: 0 }, // Hardcode season_num to 0
      },
    },
  ]);

  // Enrich results with the `script` field from fuseResults
  const enrichedResults: EpisodeInfo[] = episodesInfo.map((episode) => {
    const originalResult = fuseResults.find(
      (result) => result.item._id === episode._id
    );

    return {
      ...episode,
      script: originalResult?.item.script || null,
    };
  });

  return enrichedResults;
}

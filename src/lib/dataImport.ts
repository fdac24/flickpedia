"use server";

import { createEpisode } from "@/db/actions/episode";
import { createSeason } from "@/db/actions/season";
import { createShow, getShowById } from "@/db/actions/show";
import { IEpisode } from "@/db/models/episode";

export type DataPayload = {
  showId: string;
  showName: string;
  scripts: {
    seasonNumber: number;
    episodeName: string;
    episodeNumber: number;
    script: string;
  }[];
};

export default async function dataImport({
  showId,
  showName,
  scripts,
}: DataPayload) {
  if (showId === "-1" && !showName) {
    throw new Error("Show name is required.");
  }

  // create show if showId is "-1"
  let show;
  if (showId === "-1" && showName) {
    show = await createShow(showName);
    showId = show._id.toString(); // Update showId to the new ObjectId as a string
  } else {
    show = await getShowById(showId);
  }

  // Use for...of loop to handle async/await properly
  for (const script of scripts) {
    const {
      seasonNumber,
      episodeName,
      episodeNumber,
      script: content,
    } = script;

    // handle season
    let season = show.seasons.find(
      (season: { _id: number; number: number }) =>
        season.number === seasonNumber
    );

    // Create season if it doesn't exist
    if (!season) {
      season = await createSeason(seasonNumber, showId);
      if (!season) {
        throw new Error(`Failed to create season ${seasonNumber} for show ${showId}`);
      }

      show = await getShowById(showId); // when season is created, show is updated
    }

    const seasonId = season._id;

    const episode: IEpisode = {
      number: episodeNumber,
      name: episodeName,
      season: seasonId,
      show: showId, // Now a valid ObjectId
      script: content,
    };

    // create episode
    await createEpisode(episode);
  }
}

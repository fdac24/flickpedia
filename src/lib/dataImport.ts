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

  // create show
  const show =
    showId === "-1" && !!showName
      ? await createShow(showName)
      : await getShowById(showId);

  scripts.forEach(async (script) => {
    const {
      seasonNumber,
      episodeName,
      episodeNumber,
      script: content,
    } = script;

    // handle season
    // check season array in show, check each season for number, if season and number match then it exists
    let season = show.seasons.find(
      (season: { _id: number; number: number }) =>
        season.number === seasonNumber
    );
    if (season === undefined) {
      season = await createSeason(seasonNumber, showId);
    }
    const seasonId = season._id;

    const episode: IEpisode = {
      number: episodeNumber,
      name: episodeName,
      season: seasonId,
      show: showId,
      script: content,
    };

    // create episode
    await createEpisode(episode);
  });
}

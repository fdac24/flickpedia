/**
 * This is an independent script. It is not apart of the Next.js application.
 * First compile the typescript to javascript: pnpm --package=typescript tsc src/lib/dataScript.ts
 * Then run the javascript: pnpm dotenvx run -- node src/lib/dataScript.js
 * Make sure your terminal is in the `src` directory.
 **/

import mongoose from "mongoose";
import * as dotenvx from "@dotenvx/dotenvx";
import { EpisodeModel, SeasonModel, ShowModel } from "../db/models";
import * as fs from "fs";
import * as path from "path";

dotenvx.config({ path: "./.env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

interface Episode {
  seasonNumber: number;
  episodeNumber: number;
  episodeName: string;
  script: string;
}

async function importData() {
  const directoryPath = "../Transcripts";

  try {
    const files = await fs.promises.readdir(directoryPath);
    const episodes: Episode[] = [];

    for (const file of files) {
      const filePath = path.join(directoryPath, file);

      // Ensure it's a .txt file and matches the expected pattern
      const match = file.match(/^S(\d{2})E(\d{2})\s(.+)\.txt$/);
      if (match) {
        const [, season, episode, episodeName] = match;

        // Read the file content
        const script = await fs.promises.readFile(filePath, "utf-8");

        // Push the parsed data to the episodes array
        episodes.push({
          seasonNumber: parseInt(season, 10),
          episodeNumber: parseInt(episode, 10),
          episodeName,
          script,
        });
      }
    }

    return episodes;
  } catch (error) {
    console.error("Error reading episodes:", error);
    throw error;
  }
}

async function main() {
  if (!MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }

  await mongoose.connect(MONGODB_URI);

  const data = await importData();

  // Add data to the database
  for (const episode of data) {
    const { seasonNumber, episodeNumber, episodeName, script } = episode;

    // Find or create the show
    let show = await ShowModel.findOne({ name: "Friends" });
    if (!show) {
      show = new ShowModel({ name: "Friends", seasons: [] });
      await show.save();
    }

    // Find or create the season
    let season = await SeasonModel.findOne({
      number: seasonNumber,
      show: show._id,
    });
    if (!season) {
      season = new SeasonModel({ number: seasonNumber, show: show._id });
      await season.save();

      // Add the season to the show with required fields
      show.seasons.push({ number: season.number, id: season._id });
      await show.save();
    }

    // Create the episode
    const existingEpisode = await EpisodeModel.findOne({
      number: episodeNumber,
      season: season._id,
    });

    if (!existingEpisode) {
      console.log(
        `Importing episode S${seasonNumber}E${episodeNumber} - ${episodeName}`
      );

      const newEpisode = new EpisodeModel({
        number: episodeNumber,
        name: episodeName,
        script,
        season: season._id,
        show: show._id,
      });

      await newEpisode.save();

      season.episodes.push({
        number: newEpisode.number,
        id: newEpisode._id,
        name: newEpisode.name,
      });
      await season.save();
    } else {
      console.log(
        `Episode S${seasonNumber}E${episodeNumber} - ${episodeName} already imported.`
      );
    }
  }

  mongoose.connection.close();

  console.log("Done");
}

main();

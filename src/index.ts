import { makeCombineScoreFromDirectory } from "./make-combined-score";
import path from "node:path";
import { makeGuides } from "./make-guides";
import { projects } from "./projects-config";
import { exec } from "node:child_process";
import { log } from "node:console";

// Specify which project to use
const project = projects.robert;

const trackIndex: number | null = 2;

const trackList = project.trackList ?? [""];

if (project.trackList && trackIndex && trackList.length <= trackIndex) {
  throw new Error(`Track index ${trackIndex} is out of bounds`);
}

if (trackList.length === 0) {
  throw new Error("No tracks to generate");
}

const tracksToGenerate =
  !project.trackList && trackIndex !== null
    ? [trackList[project.trackList ? trackIndex : 0]]
    : trackList;

async function main() {
  for (const [index, trackToGenerate] of tracksToGenerate.entries()) {
    console.log(project.outputBasePath, trackToGenerate);
    const outputLocation = path.join(project.outputBasePath, trackToGenerate);

    try {
      await makeGuides({
        input: path.join(project.stemsFolder, trackToGenerate),
        output: outputLocation,
      });
    } catch (error) {
      console.error(
        `Error generating guides for ${trackToGenerate} (${index}):`,
        error
      );
    }
  }
  console.log("Opening Folder");
  exec(`start "" "${project.outputBasePath}"`, (error: any) => {
    if (error) {
      console.error("Error opening folder:", error);
    }
  });
}

// Execute the main function
main().catch((error) => {
  console.error("Unhandled error in main function:", error);
  process.exit(1);
});

// TODO: make it easier to switch to this, and add the score paths to the config
// Note: requires newer version of node
// makeCombineScoreFromDirectory(
//   "H:/My Drive/Musicals/Amazons - Musical/Amazons - For Performers"
// );

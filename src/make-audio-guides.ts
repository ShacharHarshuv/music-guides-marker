import path from "node:path";
import { exec } from "node:child_process";
import { makeGuides } from "./make-guides";
import { projects } from "./projects-config";

const project = projects.zelda;

const trackIndex: number | null = null;

const trackList = project.trackList ?? [""];

if (project.trackList && trackIndex && trackList.length <= trackIndex) {
  throw new Error(`Track index ${trackIndex} is out of bounds`);
}

if (trackList.length === 0) {
  throw new Error("No tracks to generate");
}

const tracksToGenerate =
  trackIndex !== null
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

main().catch((error) => {
  console.error("Unhandled error in main function:", error);
  process.exit(1);
});

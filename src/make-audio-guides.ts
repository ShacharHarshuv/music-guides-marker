import path from "node:path";
import { exec } from "node:child_process";
import { makeGuides } from "./make-guides";
import { projects, type ProjectConfig } from "./projects-config";
import { resolveTrackList } from "./resolve-track-list";

const project: ProjectConfig = projects.oi2;

const trackIndex: number | null = null;

const trackList = resolveTrackList(project);

if (trackIndex !== null && trackList.length <= trackIndex) {
  throw new Error(`Track index ${trackIndex} is out of bounds`);
}

const tracksToGenerate =
  trackIndex !== null ? [trackList[trackIndex]] : trackList;

async function main() {
  for (const [index, trackToGenerate] of tracksToGenerate.entries()) {
    console.log(project.outputBasePath, trackToGenerate);
    const outputLocation = path.join(project.outputBasePath, trackToGenerate);

    try {
      await makeGuides({
        input: path.join(project.stemsFolder, trackToGenerate),
        output: outputLocation,
        demosFolder: project.demosFolder,
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

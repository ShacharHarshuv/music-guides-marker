import { makeCombineScoreFromDirectory } from "./make-combined-score";
import path from "node:path";
import { makeGuides } from "./make-guides";
import { projects } from "./projects-config";

// Specify which project to use
const project = projects.rachel;

const trackIndex: number | null = null;

const tracksToGenerate =
  trackIndex !== null ? [project.trackList[trackIndex]] : project.trackList;

async function main() {
  for (const [index, trackToGenerate] of tracksToGenerate.entries()) {
    console.log(`Generating guides for ${trackToGenerate}`);
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
}

// Execute the main function
main().catch((error) => {
  console.error("Unhandled error in main function:", error);
  process.exit(1);
});

// Note: requires newer version of node
// makeCombineScoreFromDirectory('H:\\My Drive\\Musicals\\AIDEN - Musical\\15-20 minute version\\AIDEN - Production Materials');

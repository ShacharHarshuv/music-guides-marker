import { makeCombineScoreFromDirectory } from "./make-combined-score";
import path from "node:path";
import { makeGuides } from "./make-guides";

const trackList = [
  "1 - Rachel",
  "2 - Pirate Creed",
  "3 - Can't Let You Leave",
  "3a - Pirate Creed Reprise",
  "4 - Heart's Buried Treasure",
  "5 - Finale",
];

const stemsFolder =
  "G:\\My Drive\\Music\\Compositions\\Original Songs\\Musicals\\pirates guests musical\\STEMS";

const trackIndex: number | null = null;

const tracksToGenerate =
  trackIndex !== null ? [trackList[trackIndex]] : trackList;

async function main() {
  for (const [index, trackToGenerate] of tracksToGenerate.entries()) {
    console.log(`Generating guides for ${trackToGenerate}`);
    const outputLocation = path.join(
      "H:\\My Drive\\Musicals\\The Legend of Rachel - Musical\\Summerfest Production\\For Performers\\Audio Files",
      trackToGenerate
    );

    try {
      await makeGuides({
        input: path.join(stemsFolder, trackToGenerate),
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

import { makeCombineScoreFromDirectory } from "./make-combined-score";

const scoreFolder =
  "H:/.shortcut-targets-by-id/1uKs30GVCHayl1gVwYFE4j7AkWz4EavIW/Across a Crowded Room 2025 - Zelda/Reading 05-30/For Performers";

makeCombineScoreFromDirectory(scoreFolder).catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

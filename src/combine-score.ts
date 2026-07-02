import { makeCombineScoreFromDirectory } from "./make-combined-score";

const scoreFolder = "H:/My Drive/Musicals/OI (Short Film)/For Performers";

makeCombineScoreFromDirectory(scoreFolder).catch((error) => {
  console.error("Unhandled error:", error);
  process.exit(1);
});

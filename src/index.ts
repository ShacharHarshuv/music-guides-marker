import path from "node:path";
import { makeGuides } from './make-guides';
import { makeCombinedScore } from './make-combined-score';

// const trackList = ["1 - The Castles Must Be Winners", "2 - My Turn", "3 - Really", "4 - Shouldn't", "5 - Finale"];
//
// const stemsFolder =
//   "G:\\My Drive\\Music\\Compositions\\Original Songs\\Musicals\\Amazons\\STEMS";
//
// const trackToGenerate = trackList[0];
//
// const outputLocation = path.join("H:\\My Drive\\AACR - 2024\\Amazons - For Performers", trackToGenerate);
//
// makeGuides({
//   input: path.join(stemsFolder, trackToGenerate),
//   output: outputLocation,
// })

makeCombinedScore('H:\\My Drive\\AACR - 2024\\Amazons - For Performers');

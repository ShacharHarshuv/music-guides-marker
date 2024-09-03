import { combineMp3Files } from "./combine-mp3-files";
import path from "node:path";
import { mkdirSync, readdirSync, rmdirSync, rmSync } from "node:fs";

const trackList = ["1 - The Castles Must Be Winners"];

const stemsFolder =
  "G:\\My Drive\\Music\\Compositions\\Original Songs\\Musicals\\Amazons\\STEMS";

const trackToGenerate = trackList[0];

const inputLocation = path.join(stemsFolder, trackToGenerate);

const guidesFolder = "H:\\My Drive\\AACR - 2024\\Amazons - For Performers";

const outputLocation = path.join(guidesFolder, trackToGenerate);

// remove the output location if it exists
try {
  rmSync(outputLocation, { recursive: true });
} catch (e) {}
mkdirSync(outputLocation, { recursive: true });

const files = readdirSync(inputLocation).filter((file) =>
  file.endsWith(".mp3"),
);

let backtrack: string | null = null;
const rolesToGuides: Record<
  string,
  {
    guide: string;
    vox: string;
  }
> = {};

let songName: string | null = null;

files.forEach((file) => {
  const [name, role, trackType] = file.split(" -- ");

  if (songName && songName !== name) {
    throw new Error("Multiple song names found.");
  }

  songName = name;

  if (role === "Backtrack") {
    backtrack = file;
    return;
  }

  const type = trackType === "Audio" ? "vox" : "guide";

  (rolesToGuides[role] ??= { guide: "", vox: "" })[type] = file;
});

console.log(rolesToGuides);

if (!backtrack) {
  throw new Error("No backtrack found.");
}

if (!songName) {
  throw new Error("No song name found.");
}

function createTrack(name: string, files: string[]) {
  console.log(`creating ${name} ... `);
  return combineMp3Files(
    [backtrack!, ...files].map((file) => path.join(inputLocation, file)),
    path.join(outputLocation, `${songName} - ${name}.mp3`),
  );
}

function allVoicesBut(excludingRole: string) {
  return Object.entries(rolesToGuides)
    .map(([role, { vox }]) => (role !== excludingRole ? vox : null))
    .filter((vox) => vox !== null);
}

Promise.all([
  createTrack("Demo", [
    backtrack,
    ...Object.values(rolesToGuides).map(({ vox }) => vox),
  ]),
  createTrack(`Backtrack`, []),
  ...Object.entries(rolesToGuides).flatMap(([role, { guide, vox }]) => {
    return [
      createTrack(`${role} - Vocal Solo`, [vox]),
      createTrack(`${role} - Guide Solo`, [guide]),
      createTrack(`${role} - Guide with Other Voices`, [
        guide,
        ...allVoicesBut(role),
      ]),
      createTrack(`${role} - Only Other Voices`, allVoicesBut(role)),
    ];
  }),
]).then(() => {
  console.log("Finished");
});

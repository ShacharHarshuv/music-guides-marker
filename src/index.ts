import { combineMp3Files } from "./combine-mp3-files";
import path from "node:path";
import { mkdirSync, readdirSync, rmdirSync, rmSync } from "node:fs";

const inputLocation =
  "G:/My Drive/Music/Compositions/Original Songs/Musicals/Amazons/girls/Stems/amazons_girls_stems_2024-08-30";

const outputLocation = inputLocation.split("Stems").join("Guides");

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
  combineMp3Files(
    [backtrack, ...files].map((file) => path.join(inputLocation, file)),
    path.join(outputLocation, `${songName} - ${name}.mp3`),
  );
}

function allVoicesBut(excludingRole: string) {
  return Object.entries(rolesToGuides)
    .map(([role, { vox }]) => (role !== excludingRole ? vox : null))
    .filter((vox) => vox !== null);
}

createTrack(`Backtrack`, []);
Object.entries(rolesToGuides).forEach(([role, { guide, vox }]) => {
  createTrack(`${role} - Solo`, [vox]);
  createTrack(`${role} - Guide Solo`, [guide]);
  createTrack(`${role} - Guide with other voices`, [
    guide,
    ...allVoicesBut(role),
  ]);
  createTrack(`${role} - Mute`, allVoicesBut(role));
});

createTrack("Demo", [
  backtrack,
  ...Object.values(rolesToGuides).map(({ vox }) => vox),
]);

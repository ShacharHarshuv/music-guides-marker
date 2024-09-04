import { combineMp3Files } from './combine-mp3-files';
import path from 'node:path';
import {
  rmSync,
  mkdirSync,
  readdirSync,
} from 'node:fs';

export async function makeGuides(options: {
  input: string;
  output: string;
}) {
  // remove the output location if it exists
  try {
    rmSync(options.output, { recursive: true });
  } catch (e) {}
  mkdirSync(options.output, { recursive: true });

  const files = readdirSync(options.input).filter((file) =>
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
      [backtrack!, ...files].map((file) => path.join(options.input, file)),
      path.join(options.output, `${songName} - ${name}.mp3`),
    );
  }

  function allVoicesBut(excludingRole: string) {
    return Object.entries(rolesToGuides)
      .map(([role, { vox }]) => (role !== excludingRole ? vox : null))
      .filter((vox) => vox !== null);
  }

  return Promise.all([
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

}

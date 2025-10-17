import { combineMp3Files } from "./combine-mp3-files";
import path from "node:path";
import { rmSync, mkdirSync, readdirSync } from "node:fs";
import { exec } from "node:child_process";

export async function makeGuides(options: { input: string; output: string }) {
  // remove the output location if it exists
  try {
    rmSync(options.output, { recursive: true });
  } catch (e) {}
  mkdirSync(options.output, { recursive: true });

  const files = readdirSync(options.input).filter((file) =>
    file.endsWith(".mp3")
  );

  let backtrack: string | null = null;
  let dialogue: string | null = null;
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

    if (role === "Dialogue") {
      dialogue = file;
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
    console.log("files", files);
    console.log(`creating ${name} ... `);
    return combineMp3Files(
      files.map((file) => path.join(options.input, file)),
      path.join(options.output, `${songName} - ${name}.mp3`)
    );
  }

  function allVoicesBut(excludingRole: string) {
    console.log("rolesToGuides", rolesToGuides);
    return Object.entries(rolesToGuides)
      .map(([role, { vox }]) => {
        if (role !== excludingRole) {
          if (!vox) {
            throw new Error(`No vox for ${role}`);
          }

          return vox;
        }

        return null;
      })
      .filter((vox) => vox !== null);
  }

  return Promise.all([
    createTrack("Demo", [
      backtrack!,
      ...(dialogue ? [dialogue] : []),
      ...Object.values(rolesToGuides).map(({ vox }) => vox),
    ]),
    createTrack(`Backtrack`, [backtrack!]),
    ...Object.entries(rolesToGuides).flatMap(([role, { guide, vox }]) => {
      if (!vox) {
        throw new Error(`No vox for ${role}`);
      }
      if (!guide) {
        throw new Error(`No guide for ${role}`);
      }

      const isOnlyRole = Object.keys(rolesToGuides).length === 1;

      if (isOnlyRole) {
        return [createTrack(`${role} - Pluck`, [guide])];
      }

      return [
        createTrack(`${role} - Vocal Solo`, [backtrack!, vox]),
        createTrack(`${role} - Pluck Solo + backtrack`, [backtrack!, guide]), // todo: consider renaming to "Pluck w/ Accompaniment"
        createTrack(`${role} - Puck with other voices`, [
          // todo: consider renaming to "Pluck w/ Other Voices"
          backtrack!,
          guide,
          ...allVoicesBut(role),
          ...(dialogue ? [dialogue] : []),
        ]),
        createTrack(`${role} - Only Other Voices`, [
          backtrack!,
          ...(dialogue ? [dialogue] : []),
          ...allVoicesBut(role),
        ]),
        createTrack(`${role} - Pluck Solo`, [guide]),
      ];
    }),
  ]).then(() => {
    console.log("Finished");
  });
}

import { combineMp3Files } from "./combine-mp3-files";
import path from "node:path";
import { rmSync, mkdirSync, readdirSync } from "node:fs";
import { exec } from "node:child_process";

export async function makeGuides(options: {
  input: string;
  output: string;
  demosFolder?: string;
}) {
  // remove the output location if it exists
  try {
    rmSync(options.output, { recursive: true });
  } catch (e) {}
  mkdirSync(options.output, { recursive: true });
  if (options.demosFolder) {
    mkdirSync(options.demosFolder, { recursive: true });
  }

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

  console.log("rolesToGuides", rolesToGuides);
  console.log("backtrack", backtrack);
  console.log("dialogue", dialogue);

  if (!backtrack) {
    throw new Error("No backtrack found.");
  }

  if (!songName) {
    throw new Error("No song name found.");
  }

  function createTrack(
    name: string,
    files: string[],
    outputDir = options.output
  ) {
    console.log(`Creating ${name} (${files.join(", ")}) ... `);
    return combineMp3Files(
      files.map((file) => path.join(options.input, file)),
      path.join(outputDir, `${songName} - ${name}.mp3`)
    );
  }

  function allVoicesBut(excludingRole: string) {
    console.log("rolesToGuides", rolesToGuides);
    return Object.entries(rolesToGuides)
      .map(([role, { vox }]) => {
        if (role !== excludingRole) {
          if (!vox) {
            console.warn(`No vox for ${role}`);
            return null;
          }

          return vox;
        }

        return null;
      })
      .filter((vox) => vox !== null);
  }

  const hasNoVox = Object.values(rolesToGuides).every(({ vox }) => !vox);

  return Promise.all([
    ...(hasNoVox
      ? []
      : [
          createTrack(
            "Demo",
            [
              backtrack!,
              ...(dialogue ? [dialogue] : []),
              ...Object.values(rolesToGuides)
                .map(({ vox }) => vox)
                .filter((track) => track),
            ],
            options.demosFolder
          ),
        ]),
    createTrack(`Backtrack`, [backtrack!]),
    ...Object.entries(rolesToGuides).flatMap(([role, { guide, vox }]) => {
      if (!vox && !guide) {
        console.warn(`[WARNING] No vox or guide for ${role}`);
        return [];
      }
      if (!guide) {
        console.warn(
          `[WARNING] No guide for ${role}. Can still create vox tracks`
        );
      }
      if (!vox) {
        console.warn(
          `[WARNING] No vox for ${role}. Can still create guide tracks`
        );
      }

      const isOnlyRole = Object.keys(rolesToGuides).length === 1;

      if (isOnlyRole) {
        return [
          guide && createTrack(`${role} - Pluck`, [guide]),
          guide &&
            createTrack(`${role} - Pluck + Backtrack`, [backtrack!, guide]),
        ].filter((track) => track);
      }

      return [
        vox && createTrack(`${role} - Vocal Solo`, [backtrack!, vox]),
        guide &&
          createTrack(`${role} - Pluck Solo + backtrack`, [backtrack!, guide]),
        vox &&
          createTrack(`${role} - Pluck with other voices`, [
            backtrack!,
            guide,
            ...allVoicesBut(role),
            ...(dialogue ? [dialogue] : []),
          ]),
        vox &&
          createTrack(`${role} - Only Other Voices`, [
            backtrack!,
            ...(dialogue ? [dialogue] : []),
            ...allVoicesBut(role),
          ]),
        guide && createTrack(`${role} - Pluck Solo`, [guide]),
      ].filter((track) => track);
    }),
  ]).then(() => {
    console.log("Finished");
  });
}

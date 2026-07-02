import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import type { ProjectConfig } from "./projects-config";

function hasMp3Files(dir: string) {
  return readdirSync(dir).some((file) => file.endsWith(".mp3"));
}

export function resolveTrackList(project: ProjectConfig) {
  if (project.trackList !== undefined) {
    if (project.trackList.length === 0) {
      throw new Error("No tracks to generate");
    }
    return project.trackList;
  }

  const { stemsFolder } = project;
  if (!existsSync(stemsFolder)) {
    throw new Error(`Stems folder not found: ${stemsFolder}`);
  }

  const subfolders = readdirSync(stemsFolder, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith("."))
    .map((entry) => entry.name)
    .filter((name) => hasMp3Files(path.join(stemsFolder, name)))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  if (subfolders.length > 0) {
    return subfolders;
  }

  if (hasMp3Files(stemsFolder)) {
    return [""];
  }

  throw new Error(`No tracks found in stems folder: ${stemsFolder}`);
}

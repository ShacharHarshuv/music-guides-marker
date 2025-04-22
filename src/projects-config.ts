export interface ProjectConfig {
  trackList: string[];
  stemsFolder: string;
  outputBasePath: string;
}

export const projects = {
  rachel: {
    trackList: [
      "1 - Rachel",
      "2 - Pirate Creed",
      "3 - Can't Let You Leave",
      "3a - Pirate Creed Reprise",
      "4 - Heart's Buried Treasure",
      "5 - Finale",
    ],
    stemsFolder:
      "G:\\My Drive\\Music\\Compositions\\Original Songs\\Musicals\\pirates guests musical\\STEMS",
    outputBasePath:
      "H:\\My Drive\\Musicals\\The Legend of Rachel - Musical\\Summerfest Production\\For Performers\\Audio Files",
  },
} satisfies Record<string, ProjectConfig>;

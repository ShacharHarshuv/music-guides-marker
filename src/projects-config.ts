export interface ProjectConfig {
  trackList?: string[];
  stemsFolder: string;
  outputBasePath: string;
  demosFolder?: string;
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
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/pirates guests musical/STEMS",
    outputBasePath:
      "H:/My Drive/Musicals/The Legend of Rachel - Musical/Summerfest Production/For Performers/Audio Files",
  },
  jack: {
    trackList: ["1 - Beautiful", "2 - Plant Them Beans", "3 - Harp Reprise"],
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/Jack and Harper/STEMS",
    outputBasePath:
      "H:/My Drive/Musicals/Jack and the Harp/For Performers/Audio Files",
  },
  amazons: {
    trackList: [
      "1 - The Castles Must Be Winners",
      "2 - My Turn",
      "3 - Really 2",
      "4 - Shouldn't",
      "5 - Finale",
    ],
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/Amazons/STEMS",
    outputBasePath:
      "H:/My Drive/Musicals/Amazons - Musical/Amazons - For Performers",
  },
  flitch: {
    trackList: ["everyday moments"],
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/bringing home the bacon/STEMS",
    outputBasePath:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/bringing home the bacon/For Performers",
  },
  robert: {
    trackList: undefined,
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/standalone musical numbers/Blanche 2025/STEMS",
    outputBasePath:
      "H:/My Drive/Non-show-specific submisisons/BMI Workshop/BMI Class 2025 (Auditing)/Exercises/Blanche Song 2025/For Performers",
  },
  blanche: {
    trackList: undefined,
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/standalone musical numbers/Blanche 2025/STEMS",
    outputBasePath:
      "H:/My Drive/Non-show-specific submisisons/BMI Workshop/BMI Class 2025 (Auditing)/Exercises/Blanche Song 2025/For Performers",
  },
  lift: {
    trackList: undefined,
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/standalone musical numbers/punchup 2025/STEMS",
    outputBasePath:
      "H:/My Drive/Standalone songs/Punchup26-rob&clay/Rehearsal Tracks",
  },
  foreverfornow: {
    trackList: undefined,
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/standalone musical numbers/bmi love song 2026 Hazel Gus/STEMS",
    outputBasePath:
      "H:/My Drive/BMI Workshop/BMI Class 2025 (Auditing)/Exercises/love song Clay & Anya/For Performers/Tracks",
  },
  mbf: {
    trackList: undefined,
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/standalone musical numbers/m butterfly bmi 2025/STEMS",
    outputBasePath:
      "H:/My Drive/BMI Workshop/BMI Class 2025 (Auditing)/Exercises/M. Butterfly - Musical Scene/For Performers/Tracks",
  },
  oi: {
    trackList: [
      "1 - Can I Get a Drink",
      "2.1 - Original Idea - Part 1",
      "2.2 - Original Idea - Part 2",
      "2.3 - Original Idea - Part 3",
      "3 - Immunity",
    ],
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/O.I/STEMS",
    outputBasePath: "H:/My Drive/Musicals/OI (Short Film)/For Performers/Audio",
  },
  oi2: {
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/O.I/STEMS 2",
    outputBasePath: "H:/My Drive/Musicals/OI (Short Film)/For Performers/audio",
    demosFolder: "H:/My Drive/Musicals/OI (Short Film)/For Performers/demos",
  },
  zelda: {
    stemsFolder:
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/Zelda/STEMS",
    outputBasePath:
      "H:/.shortcut-targets-by-id/1uKs30GVCHayl1gVwYFE4j7AkWz4EavIW/Across a Crowded Room 2025 - Zelda/Reading 05-30/For Performers",
    trackList: [
      "1 - Who Are You",
      "2 - It's Never Too Late",
      "3 - Nothing Ever Changes",
      "4 - You Never Know",
    ],
  },
} satisfies Record<string, ProjectConfig>;

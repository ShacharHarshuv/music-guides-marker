export interface ProjectConfig {
  trackList?: string[];
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
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/pirates guests musical/STEMS",
    outputBasePath:
      "H:/My Drive/Musicals/The Legend of Rachel - Musical/Summerfest Production/For Performers/Audio Files",
  },
  jack: {
    trackList: ["1 - Beautiful", "2 - Plant Them Beans"],
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
      "G:/My Drive/Music/Compositions/Original Songs/Musicals/standalone musical numbers/princess bride - dreadful pirate robert/STEMS",
    outputBasePath:
      "H:/My Drive/Non-show-specific submisisons/BMI Workshop/BMI Class 2025 (Auditing)/Exercises/say not what you mean/The Dread Pirate Roberts/For Performers",
  },
} satisfies Record<string, ProjectConfig>;

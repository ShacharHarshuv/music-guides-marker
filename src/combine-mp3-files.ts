import ffmpeg from "fluent-ffmpeg";

export function combineMp3Files(inputFiles: string[], outputFile: string) {
  return new Promise((resolve, reject) => {
    const command = ffmpeg();
    inputFiles.forEach((file) => command.input(file));

    // Set up the complex filter with the number of inputs
    command
      .complexFilter([
        {
          filter: "amix",
          options: { inputs: inputFiles.length, duration: "longest", normalize: 0 },
        },
      ])
      .audioCodec("libmp3lame")
      .output(outputFile)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
  // Add each input file to the command
}

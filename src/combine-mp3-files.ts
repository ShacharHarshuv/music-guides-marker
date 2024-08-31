import ffmpeg from "fluent-ffmpeg";

export function combineMp3Files(inputFiles: string[], outputFile: string) {
  const command = ffmpeg();

  // Add each input file to the command
  inputFiles.forEach((file) => command.input(file));

  // Set up the complex filter with the number of inputs
  command
    .complexFilter([
      {
        filter: "amix",
        options: { inputs: inputFiles.length, duration: "longest" },
      },
    ])
    .audioCodec("libmp3lame")
    .output(outputFile)
    .on("end", () => {
      console.log("Files have been combined successfully.");
    })
    .on("error", (err) => {
      console.error("Error combining files:", err);
    })
    .run();
}

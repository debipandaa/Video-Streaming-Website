const fs = require("fs");
const path = require("path");
const mime = require("mime-types");
const { spawn } = require("child_process");
const { get } = require("http");

function extractMagnetLink(text) {
  const regex = /Magnet Link:\s*(magnet:\?xt=[^\s]+)/;
  const match = text.match(regex);
  return match ? match[1] : null;
}

// function findMovieInFolder(movieTitle, folderPath) {
//   const normalizedTitle = movieTitle.toLowerCase().replace(/-/g, " ");
//   let result = null;

//   const filesAndDirs = fs.readdirSync(folderPath);

//   // Iterate through all files and subdirectories
//   for (let fileOrDir of filesAndDirs) {
//     const fullPath = path.join(folderPath, fileOrDir);
//     const stat = fs.statSync(fullPath);

//     // If it's a directory, recursively search inside it
//     if (stat.isDirectory()) {
//       result = findMovieInFolder(movieTitle, fullPath);
//     } else if (
//       stat.isFile() &&
//       fileOrDir.toLowerCase().includes(normalizedTitle)
//     ) {
//       // If it's a file and its name contains the movie title
//       result = fullPath;
//       break; // Stop as soon as a file is found
//     }

//     // If result is found, no need to continue further
//     if (result) break;
//   }

//   return result;
// }
function findMovieInFolder(movieTitle, folderPath) {
  let keywords = movieTitle.split(/[-_ ]+/); // This splits by hyphens, underscores, or spaces
  keywords = keywords.map((keyword) => keyword.toLowerCase());
  let result = [];

  // Read the directory content
  const files = fs.readdirSync(folderPath);

  // Iterate through the files and subfolders
  files.forEach((file) => {
    const fullPath = path.join(folderPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Recursively search in subdirectories
      result = result.concat(findMovieInFolder(movieTitle, fullPath));
    } else if (stat.isFile()) {
      // Check if the file name includes all the keywords
      const fileName = file.toLowerCase();
      if (
        keywords.every((keyword) => fileName.includes(keyword.toLowerCase()))
      ) {
        result.push(fullPath);
      }
    }
  });

  return result;
}
async function getMagnetLink(searchQuery, category) {
  const maxRetries = 3; // Limit the number of retries
  let attempts = 0;

  while (attempts < maxRetries) {
    attempts++;
    try {
      const magnetlink = await new Promise((resolve, reject) => {
        // const pythonProcess = spawn("python3", [
        //   "/media/debi/New Volume/plz_dont_sleep_without_completing/backend/project/src/python_torrent/search.py",
        const path = require("path");

        const scriptPath = path.join(__dirname, "../python_torrent/search.py");

        const pythonProcess = spawn("python3", [
          scriptPath,
          searchQuery,
          category,
        ]);

        pythonProcess.stdout.on("data", (data) => {
          const link = extractMagnetLink(data.toString().trim());
          resolve(link);
        });

        pythonProcess.stderr.on("data", (data) => {
          console.error(`Errorbaby: ${data.toString()}`);
        });

        pythonProcess.on("errorbaby", (err) => {
          reject(err);
        });

        pythonProcess.on("close", (code) => {
          if (code !== 0) {
            reject(new Error(`Python script exited with code ${code}`));
          }
        });
      });

      return magnetlink; // If successful, return the magnet link
    } catch (error) {
      console.error(`Attempt ${attempts} failed: ${error.message}`);
      if (attempts >= maxRetries) {
        throw new Error(
          "Exceeded maximum retry attempts. Could not fetch magnet link."
        );
      }
      console.log(`Retrying... (${attempts}/${maxRetries})`);
    }
  }
}

async function startDownload(magnetlink) {
  if (!magnetlink) {
    throw new Error("Magnet link is not provided.");
  }

  try {
    const progress = await new Promise((resolve, reject) => {
      const path = require("path");

      const scriptPath = path.join(__dirname, "../python_torrent/main.py");

      const downloading = spawn("python3", [scriptPath, magnetlink]);

      // const downloading = spawn("python3", [
      //   "/media/debi/New Volume/plz_dont_sleep_without_completing/backend/project/src/python_torrent/main.py",
      //   magnetlink,
      // ]);

      let initialProgressLogged = false;

      downloading.stdout.on("data", (data) => {
        const output = data.toString().trim();
        console.log(output);

        // Check for progress output
        const match = output.match(/Progress: (\d+(\.\d+)?)/); // Match "Progress: X"
        if (match) {
          const progress = parseFloat(match[1]);
          if (!initialProgressLogged && progress > 1) {
            initialProgressLogged = true;
            resolve(progress); // Resolve when progress exceeds 1%
          }
        }

        // Log download completion
        if (output.includes("Download complete!")) {
          resolve(100); // Assume 100% if complete
        }
      });

      downloading.stderr.on("data", (data) => {
        console.error(`ErrorBabyyoo: ${data.toString()}`);
      });

      downloading.on("error", (err) => {
        reject(err);
      });

      downloading.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Python script exited with code ${code}`));
        }
      });
    });

    console.log(`Download started successfully with progress: ${progress}%`);
    return progress;
  } catch (error) {
    console.error("Error during download process:", error.message);
    throw error;
  }
}

const getMoviePath = async (movieTitle, count = 5) => {
  if (count === 0) {
    throw new Error(`Movie with title "${movieTitle}" not found.`);
  }

  let magnetlink = null;
  const movieFolder = path.join(process.env.MEDIA_PATH);
  const movieFile = findMovieInFolder(movieTitle, movieFolder)[0];
  console.log("Found Movie File:", movieFile);

  if (movieFile) {
    return path.join(movieFile);
  } else {
    const searchQuery = movieTitle;
    const category = "all";

    try {
      magnetlink = await getMagnetLink(searchQuery, category);

      if (magnetlink) {
        const progress = await startDownload(magnetlink);
        console.log(
          `Download is in progress with initial progress: ${progress}%`
        );
        // const downloading = awaitspawn("python3", [
        //   "/media/debi/New Volume/plz_dont_sleep_without_completing/backend/project/src/python_torrent/main.py",
        //   magnetlink,
        // ]);
        // downloading.stderr.on("data", (data) => {
        //   console.error(`ErrorBabyyoo: ${data.toString()}`);
        // });
        // console.log("Download started, proceeding with search...");

        // if (count > 0) {
        //   return await getMoviePath(movieTitle, count - 1); // Retry with decremented count
        // }
      } else {
        // Handle case where no magnet link is found
        if (count > 0) {
          return await getMoviePath(movieTitle, count - 1); // Retry with decremented count
        }
        throw new Error(`No magnet link found for "${movieTitle}"`);
      }
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
};

exports.streamVideoFile = async (file, req, res, next) => {
  try {
    const filePath = await getMoviePath(file);
    console.log("File found:", filePath);

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const range = req.headers.range;
    if (!range) {
      return next(new Error("Range header is required"));
    }

    const fileExtension = path.extname(filePath).toLowerCase();
    const contentType =
      mime.lookup(fileExtension) || "application/octet-stream";

    if (
      fileExtension === ".mp4" ||
      fileExtension === ".mkv" ||
      fileExtension === ".webm"
    ) {
      // Transcode x265 or unsupported formats to MP4 on-the-fly
      const ffmpeg = spawn("ffmpeg", [
        "-i",
        filePath, // Input file
        "-f",
        "mp4", // Output format
        "-movflags",
        "frag_keyframe+empty_moov", // For streaming
        "-vf",
        "scale=1280:-2", // Adjust resolution if needed
        "-c:v",
        "libx264", // Video codec (H.264)
        "-c:a",
        "aac", // Audio codec (AAC)
        "-strict",
        "experimental", // Experimental flag for AAC
        "-", // Output to stdout
      ]);

      res.writeHead(200, {
        "Content-Type": "video/mp4",
      });

      ffmpeg.stdout.pipe(res);

      ffmpeg.stderr.on("data", (data) => {
        console.error("ffmpeg error:", data.toString());
      });

      ffmpeg.on("error", (err) => {
        console.error("ffmpeg error:", err);
        next(err);
      });

      ffmpeg.on("close", () => {
        console.log("Transcoding finished");
      });

      // Stop the transcoding process if the client closes the connection
      res.on("close", () => {
        console.log("Client disconnected, aborting transcoding...");
        ffmpeg.kill("SIGINT"); // Send SIGINT to stop the ffmpeg process
      });
    } else if (fileExtension === ".mp4") {
      // Native MP4 Streaming (without transcoding)
      const stat = fs.statSync(filePath);
      const fileSize = stat.size;

      const parts = range.replace(/bytes=/, "").split("-");
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const stream = fs.createReadStream(filePath, { start, end });
      res.writeHead(200, {
        "Content-Range": `bytes ${start}-${end}/${fileSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": end - start + 1,
        "Content-Type": "video/mp4",
      });
      stream.pipe(res);

      // Stop streaming if the client closes the connection
      res.on("close", () => {
        console.log("Client disconnected, stopping file stream...");
        stream.destroy(); // Close the read stream
      });
    }
  } catch (err) {
    next(err);
  }
};

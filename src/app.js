import inquirer from "inquirer";
import commander from "commander";
import fs from "fs";

const chooseChunks = (chunks, defaults) => {
  return inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Choose code blocks to swapple.",
        name: "chunks",
        choices: chunks,
        default: defaults
      }
    ])
    .then(chunks => {
      return chunks.chunks;
    });
};

type CommentTypeT = "#" | "//";

export const getName = line => {
  let lineBeginning = line.match(/(.+(swapple)\s((start)|(end)))/g);
  if (lineBeginning === null) return null;
  let nameStartPos = lineBeginning[0].length + 1;
  let nameEndPos = line.indexOf(" ", nameStartPos);
  return nameEndPos < 0
    ? line.slice(nameStartPos).trim()
    : line.slice(nameStartPos, nameEndPos).trim();
};

export const findStartIndicies = (
  file: string[],
  commentType: CommentTypeT
) => {
  return file
    .map((line, index) => {
      return line.includes(commentType + " swapple start")
        ? {
            name: getName(line),
            start: index,
            turnedOn: file[index + 1].indexOf(commentType) < 0
          }
        : false;
    })
    .filter(Boolean);
};

export const findEndIndicies = (file: string[], commentType: CommentTypeT) => {
  return file
    .map((line, index) => {
      return line.includes(commentType + " swapple end")
        ? {
            name: getName(line),
            end: index
          }
        : false;
    })
    .filter(Boolean);
};

export const mergeChunks = (beginning, end) => {
  return beginning
    .map((firstHalf, index) => {
      return end[index]
        ? {
            ...firstHalf,
            end: end[index].end
          }
        : false;
    })
    .filter(Boolean);
};

export const findCodeChunks = (file: string[], commentType: CommentTypeT) => {
  // Return name of chunk, start index, end index, and whether
  // chunk is turned on or not.

  let beginning = findStartIndicies(file, commentType);
  let end = findEndIndicies(file, commentType);
  return mergeChunks(beginning, end);
};

type ChunkT = {
  name: string,
  start: number,
  end: number,
  turnedOn: boolean
};

export const buildFile = (
  page: string[],
  chunks: ChunkT[],
  commentType: string
) => {
  chunks.forEach(chunk => {
    if (chunk.turnedOn) {
      if (page[chunk.start + 1].indexOf(commentType) >= 0) {
        for (let line = chunk.start + 1; line < chunk.end; line++) {
          page[line] = page[line].replace(commentType, "");
        }
      }
    } else {
      if (page[chunk.start + 1].indexOf(commentType) < 0) {
        for (let line = chunk.start + 1; line < chunk.end; line++) {
          page[line] = commentType + page[line];
        }
      }
    }
  });
  return page;
};

export const swapple = (commentType, filePath) => {
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) throw err;

    let page = data.split("\n");

    let chunks = findCodeChunks(page, commentType);

    let defaults = [];
    chunks.forEach(chunk => {
      if (chunk.turnedOn === true) defaults.push(chunk.name);
    });

    let toggledOn = await chooseChunks(chunks, defaults);
    chunks.forEach(chunk => {
      chunk.turnedOn = toggledOn.indexOf(chunk.name) >= 0;
    });

    fs.writeFile(
      filePath,
      buildFile(page, chunks, commentType).join("\n"),
      err => {
        if (err) {
          return console.log(err);
        }

        console.log("Let me swapple that for ya!");
      }
    );
  });
};

export default argv => {
  commander.option("<filePath>").action(filePath => {
    let file = filePath.split(".");
    let fileType = file[file.length - 1];
    let commentType = {
      js: "//",
      java: "//",
      c: "//",
      cpp: "//",
      py: "#",
      rb: "#",
      conf: "#"
    };

    commentType[fileType]
      ? swapple(commentType[fileType], filePath)
      : console.log(
          "I'm terribly sorry, but that file type is not supported." +
            "\nBut feel free to make a request for support at https://github.com/ClintonBaker/Swapple"
        );
  });

  commander.parse(argv);
};

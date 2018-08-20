#!/usr/bin/env node
import inquirer from "inquirer";
import commander from "commander";
import fs from "fs";

const chooseChunks = (chunks, def) => {
  return inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Choose code blocks to swapple.",
        name: "chunks",
        choices: chunks,
        default: def
      }
    ])
    .then(chunks => {
      return chunks.chunks;
    });
};

const findCodeChunks = (file, commentType) => {
  // Return name of chunk, start index, end index, and whether
  // chunk is turned on or not.

  let chunks = [];
  for (let firstOccurence = 0; firstOccurence < file.length; firstOccurence++) {
    if (file[firstOccurence].indexOf(commentType + " start") >= 0) {
      for (
        let secondOccurence = firstOccurence + 1;
        secondOccurence < file.length;
        secondOccurence++
      ) {
        if (file[secondOccurence].indexOf(commentType + " end") >= 0) {
          let nameStartPos = file[firstOccurence].indexOf("start") + 5;
          let nameEndPos = file[firstOccurence].indexOf(
            commentType,
            nameStartPos
          );
          let chunkName =
            nameEndPos < 0
              ? file[firstOccurence].slice(nameStartPos).trim()
              : file[firstOccurence].slice(nameStartPos, nameEndPos).trim();
          let turnedOn = file[firstOccurence + 1].indexOf(commentType) < 0;
          chunks.push({
            name: chunkName,
            start: firstOccurence,
            end: secondOccurence,
            turnedOn
          });
          break;
        }
      }
    }
  }

  return chunks;
};

type ChunkT = {
  name: string,
  start: number,
  end: number,
  turnedOn: boolean
}

export const swap = (page: string[], chunks: ChunkT[], commentType: string) => {
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
  return page.join("\n");
};

let swapple = (commentType, filePath) => {
  fs.readFile(filePath, "utf8", async (err, data) => {
    if (err) throw err;

    let page = data.split("\n");

    let chunks = findCodeChunks(page, commentType);
    let def = [];
    chunks.forEach(chunk => {
      if (chunk.turnedOn === true) def.push(chunk.name);
    });

    let toggledOn = await chooseChunks(chunks, def);
    chunks.forEach(chunk => {
      chunk.turnedOn = toggledOn.indexOf(chunk.name) >= 0;
    });

    fs.writeFile(filePath, swap(page, chunks, commentType), err => {
      if (err) {
        return console.log(err);
      }

      console.log("Let me swapple that for ya!");
    });
  });
};

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

commander.parse(process.argv);

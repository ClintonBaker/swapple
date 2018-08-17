#!/usr/bin/env node
"use strict";

var _inquirer = _interopRequireDefault(require("inquirer"));

var _commander = _interopRequireDefault(require("commander"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chooseChunks = (chunks, def) => {
  return _inquirer.default.prompt([{
    type: "checkbox",
    message: "Choose code blocks to swapple.",
    name: "chunks",
    choices: chunks,
    default: def
  }]).then(chunks => {
    return chunks.chunks;
  });
};

const findCodeChunks = (file, commentType) => {
  // Return name of chunk, start index, end index, and whether
  // chunk is turned on or not.
  let chunks = [];

  for (let firstOccurence = 0; firstOccurence < file.length; firstOccurence++) {
    if (file[firstOccurence].indexOf(commentType + " start") >= 0) {
      for (let secondOccurence = firstOccurence + 1; secondOccurence < file.length; secondOccurence++) {
        if (file[secondOccurence].indexOf(commentType + " end") >= 0) {
          let nameStartPos = file[firstOccurence].indexOf("start") + 5;
          let nameEndPos = file[firstOccurence].indexOf(commentType, nameStartPos);
          let chunkName = nameEndPos < 0 ? file[firstOccurence].slice(nameStartPos).trim() : file[firstOccurence].slice(nameStartPos, nameEndPos).trim();
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

const swap = (page, chunks, commentType) => {
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
  _fs.default.readFile(filePath, "utf8", async (err, data) => {
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

    _fs.default.writeFile(filePath, swap(page, chunks, commentType), err => {
      if (err) {
        return console.log(err);
      }

      console.log("Let me swapple that for ya!");
    });
  });
};

_commander.default.option("<filePath>").action(filePath => {
  let file = filePath.split(".");
  let fileType = file[file.length - 1];
  let commentType = {
    js: "//",
    java: "//",
    c: "//",
    "c++": "//",
    py: "#",
    confd: "#"
  };
  swapple(commentType[fileType], filePath);
});

_commander.default.parse(process.argv); // Yo, man! This is intense! =D
// Do your thang, man. This is good shit.
// I'll see if I can get through it lol. I should have it ready
// By tomorrow.
// Hehehe. 0.0.0, mang. Nothing is ready until 1.0.0!
// There are weird things that will happen with publishing.
// Just wanna see to it that we get the name reserved and such.
// Or you can handle it :) You got this under control!
// No, lol. Just for publishing. :)
// Basically, our file is found at /etc/apache2/http.confd
// Yeah, and the comments start with "#".
// And it asks us for password to save the file
// and again to run sudo apachectl restart.
// https://medium.com/netscape/a-guide-to-create-a-nodejs-command-line-package-c2166ad0452e
// https://medium.freecodecamp.org/how-to-make-a-beautiful-tiny-npm-package-and-publish-it-2881d4307f78
// Good luck creating this for Mac users without having a mac! =P
// Yeppers!
// Looks legit! Let's go ahead and publish 0.0.0, yeah?
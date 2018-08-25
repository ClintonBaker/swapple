"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.swapple = exports.buildFile = exports.findCodeChunks = exports.mergeChunks = exports.findEndIndicies = exports.findStartIndicies = exports.getName = void 0;

var _inquirer = _interopRequireDefault(require("inquirer"));

var _commander = _interopRequireDefault(require("commander"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const chooseChunks = (chunks, defaults) => {
  return _inquirer.default.prompt([{
    type: "checkbox",
    message: "Choose code blocks to swapple.",
    name: "chunks",
    choices: chunks,
    default: defaults
  }]).then(chunks => {
    return chunks.chunks;
  });
};

const getName = line => {
  let lineBeginning = line.match(/(.+(swapple)\s((start)|(end)))/g);
  if (lineBeginning === null) return null;
  let nameStartPos = lineBeginning[0].length + 1;
  let nameEndPos = line.indexOf(" ", nameStartPos);
  return nameEndPos < 0 ? line.slice(nameStartPos).trim() : line.slice(nameStartPos, nameEndPos).trim();
};

exports.getName = getName;

const findStartIndicies = (file, commentType) => {
  return file.map((line, index) => {
    return line.includes(commentType + " swapple start") ? {
      name: getName(line),
      start: index,
      turnedOn: file[index + 1].indexOf(commentType) < 0
    } : false;
  }).filter(Boolean);
};

exports.findStartIndicies = findStartIndicies;

const findEndIndicies = (file, commentType) => {
  return file.map((line, index) => {
    return line.includes(commentType + " swapple end") ? {
      name: getName(line),
      end: index
    } : false;
  }).filter(Boolean);
};

exports.findEndIndicies = findEndIndicies;

const mergeChunks = (beginning, end) => {
  return beginning.map((firstHalf, index) => {
    return end[index] ? { ...firstHalf,
      end: end[index].end
    } : false;
  }).filter(Boolean);
};

exports.mergeChunks = mergeChunks;

const findCodeChunks = (file, commentType) => {
  // Return name of chunk, start index, end index, and whether
  // chunk is turned on or not.
  let beginning = findStartIndicies(file, commentType);
  let end = findEndIndicies(file, commentType);
  return mergeChunks(beginning, end);
};

exports.findCodeChunks = findCodeChunks;

const buildFile = (page, chunks, commentType) => {
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

exports.buildFile = buildFile;

const swapple = (commentType, filePath) => {
  _fs.default.readFile(filePath, "utf8", async (err, data) => {
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

    _fs.default.writeFile(filePath, buildFile(page, chunks, commentType).join("\n"), err => {
      if (err) {
        return console.log(err);
      }

      console.log("Let me swapple that for ya!");
    });
  });
};

exports.swapple = swapple;

var _default = argv => {
  _commander.default.option("<filePath>").action(filePath => {
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
    commentType[fileType] ? swapple(commentType[fileType], filePath) : console.log("I'm terribly sorry, but that file type is not supported." + "\nBut feel free to make a request for support at https://github.com/ClintonBaker/Swapple");
  });

  _commander.default.parse(argv);
};

exports.default = _default;
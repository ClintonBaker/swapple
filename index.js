import inquirer from "inquirer";
import fs from "fs";

const chooseChunks = chunks => {
  return inquirer
    .prompt([
      {
        type: "checkbox",
        message: "Choose code blocks to swapple",
        name: "chunks",
        choices: chunks
      }
    ])
    .then(chunks => {
      return chunks.chunks;
    });
};

const findCodeChunks = file => {
  // Return name of chunk, start index, and end index.

  let chunks = [];
  for (let firstOccurence = 0; firstOccurence < file.length; firstOccurence++) {
    if (file[firstOccurence].indexOf("// +") >= 0) {
      for (
        let secondOccurence = firstOccurence + 1;
        secondOccurence < file.length;
        secondOccurence++
      ) {
        if (file[secondOccurence].indexOf("// -") >= 0) {
          let chunkName = file[firstOccurence]
            .slice(file[firstOccurence].indexOf("+") + 1)
            .trim();
          let toggled = file[firstOccurence + 1].indexOf("//") < 0;
          chunks.push({
            name: chunkName,
            start: firstOccurence,
            end: secondOccurence,
            toggled
          });
          break;
        }
      }
    }
  }

  return chunks;
};

const swapple = (page, chunks, toToggle) => {
  chunks.forEach(chunk => {
    if (toToggle.indexOf(chunk.name) >= 0) {
      for (let line = chunk.start + 1; line < chunk.end; line++) {
        if (chunk.toggled) {
          page[line] = "//" + page[line];
        } else {
          page[line] = page[line].replace("//", "");
        }
      }
    }
  });
  return page.join("\n");
};

fs.readFile("test.js", "utf8", async (err, data) => {
  if (err) throw err;

  let page = data.split("\n");

  const chunks = findCodeChunks(page);

  let toToggle = await chooseChunks(chunks);

  fs.writeFile("test.js", swapple(page, chunks, toToggle), err => {
    if (err) {
      return console.log(err);
    }

    console.log("Let me swapple that for ya!");
  });
});

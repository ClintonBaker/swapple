import { buildFile, findCodeChunks } from "../app";

const mockFile = [
  "foo",
  "foo",
  "# swapple start STUB",
  "foo",
  "foo",
  "# swapple end STUB",
  "foo",
  "foo",
  "# swapple start STUB1",
  "#foo",
  "#foo",
  "# swapple end STUB1",
  "# swapple start STUB2",
  "#foo",
  "#foo",
  "# swapple end",
  "# swapple start STUB3",
  "code",
  "goes",
  "here"
];

let chunks = findCodeChunks(mockFile, "#");

test("😅 should return an array.", () => {
  expect(Array.isArray(buildFile(mockFile, chunks, "#"))).toBe(true);
});

test("😅 array returned should be composed of strings.", () => {
  expect(typeof buildFile(mockFile, chunks, "#")[0]).toBe("string");
});

test("😅 should toggle comments on and off as expected.", () => {
  let altChunks = [...chunks];
  altChunks[0].turnedOn = false;
  expect(buildFile(mockFile, altChunks, "#")).toEqual([
    "foo",
    "foo",
    "# swapple start STUB",
    "#foo",
    "#foo",
    "# swapple end STUB",
    "foo",
    "foo",
    "# swapple start STUB1",
    "#foo",
    "#foo",
    "# swapple end STUB1",
    "# swapple start STUB2",
    "#foo",
    "#foo",
    "# swapple end",
    "# swapple start STUB3",
    "code",
    "goes",
    "here"
  ]);
});

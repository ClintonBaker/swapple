"use strict";

var _app = require("../app");

const mockFile = ["foo", "foo", "# swapple start STUB", "foo", "foo", "# swapple end STUB", "foo", "foo", "# swapple start STUB1", "#foo", "#foo", "# swapple end STUB1", "# swapple start STUB2", "#foo", "#foo", "# swapple end", "# swapple start STUB3", "code", "goes", "here"];
let topHalf = (0, _app.findStartIndicies)(mockFile, "#");
let bottomHalf = (0, _app.findEndIndicies)(mockFile, "#");
let chunks = (0, _app.mergeChunks)(topHalf, bottomHalf);
test("should return an array", () => {
  expect(Array.isArray(chunks)).toBe(true);
});
test("elements of array are objects", () => {
  chunks.forEach(chunk => {
    expect(typeof chunk).toBe("object");
  });
});
test("object has appropriate attributes", () => {
  expect(chunks[0]).toEqual({
    name: "STUB",
    start: 2,
    turnedOn: true,
    end: 5
  });
  expect(chunks[1]).toEqual({
    name: "STUB1",
    start: 8,
    turnedOn: false,
    end: 11
  });
  expect(chunks[2]).toEqual({
    name: "STUB2",
    start: 12,
    turnedOn: false,
    end: 15
  });
});
test("should ignore any incomplete code chunks.", () => {
  expect(chunks.length).toBe(3);
});
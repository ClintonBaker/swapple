"use strict";

var _app = require("../app");

const mockFile = ["foo", "foo", "# swapple start STUB", "foo", "foo", "# swapple end STUB", "foo", "foo", "# swapple start STUB1", "#foo", "#foo", "# swapple end STUB1"];
let chunks = (0, _app.findStartIndicies)(mockFile, "#");
test("it returns an array", () => {
  expect(Array.isArray(chunks)).toBe(true);
});
test("elements in the array returned are objects", () => {
  chunks.forEach(chunk => {
    expect(typeof chunk).toBe("object");
  });
});
test("should produce an appropriate object", () => {
  expect(chunks[0]).toEqual({
    name: "STUB",
    start: 2,
    turnedOn: true
  });
  expect(chunks[1]).toEqual({
    name: "STUB1",
    start: 8,
    turnedOn: false
  });
});
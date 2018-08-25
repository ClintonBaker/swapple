"use strict";

var _app = require("../app");

const mockFile = ["foo", "foo", "# swapple start STUB", "foo", "foo", "# swapple end STUB", "foo", "foo", "# swapple start STUB1", "#foo", "#foo", "# swapple end STUB1", "# swapple start STUB2", "#foo", "#foo", "# swapple end"];
let chunks = (0, _app.findEndIndicies)(mockFile, "#");
test("it returns an array", () => {
  expect(Array.isArray(chunks)).toEqual(true);
});
test("elements in the array returned are objects", () => {
  chunks.forEach(chunk => {
    expect(typeof chunk).toEqual("object");
  });
});
test("should produce an appropriate object", () => {
  expect(chunks[0]).toEqual({
    name: "STUB",
    end: 5
  });
  expect(chunks[1]).toEqual({
    name: "STUB1",
    end: 11
  });
  expect(chunks[2]).toEqual({
    name: "",
    end: 15
  });
});
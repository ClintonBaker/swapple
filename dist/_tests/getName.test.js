"use strict";

var _app = require("../app");

const mockLines = ["// swapple start foo", "# swapple start foo", "// swapple start prod trashGoesHere*sdf//", "### swapple start DevServ ###", " let foo = 'bar'"];
test("it returns a string", () => {
  expect(typeof (0, _app.getName)(mockLines[0])).toBe("string");
});
test("it returns appropriate name", () => {
  expect((0, _app.getName)(mockLines[0])).toBe("foo");
  expect((0, _app.getName)(mockLines[1])).toBe("foo");
  expect((0, _app.getName)(mockLines[2])).toBe("prod");
  expect((0, _app.getName)(mockLines[3])).toBe("DevServ");
});
test("returns null if no name is appropriate", () => {
  expect((0, _app.getName)(mockLines[4])).toBe(null);
});
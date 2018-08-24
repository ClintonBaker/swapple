import { getName } from "../app";

const mockLines = [
  "// swapple start foo",
  "# swapple start foo",
  "// swapple start prod trashGoesHere*sdf//",
  "### swapple start DevServ ###",
  " let foo = 'bar'"
];

test("it returns a string", () => {
  expect(typeof getName(mockLines[0])).toBe("string");
});

test("it returns appropriate name", () => {
  expect(getName(mockLines[0])).toBe("foo");
  expect(getName(mockLines[1])).toBe("foo");
  expect(getName(mockLines[2])).toBe("prod");
  expect(getName(mockLines[3])).toBe("DevServ");
});

test("returns null if no name is appropriate", () => {
  expect(getName(mockLines[4])).toBe(null);
});

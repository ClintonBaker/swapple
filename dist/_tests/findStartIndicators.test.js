"use strict";

var _app = require("../app");

// global === Node's window object, kind of.
// This isn't necessary, just declarative of where these things come from.
const {
  describe,
  it,
  expect
} = global;
test.skip("it is a function", () => {
  expect(typeof _app.findStartIndicators).toEqual("function");
}); // // Should it return a number?
// // What if it returned an array of object
// // [{ startPosition: number, blockName: string }, { startPosition: number, blockName: string }]
// // No. Does 1 thing very well -- finds the shit haha.
// // Returninng it for us to process further.
// const mockFileLines = [
//     'foo',
//     '# swapple start STUB',
//     'foo',
//     'foo',
//     '# swapple end STUB',
//     '# swapple start STUB1',
//     'foo',
//     'foo',
//     '# swapple end STUB1',
//     'foo'
// ]
// test('it returns an array of objects', () => {
//     const result = typeof findStartIndicators(mockFileLines, '#')
//     expect(Array.isArray(result)).toBeTruthy()
//     // TODO: Test that all array items are objects.
// })
// // Hehe. Yes and no. Yes, because all dependencies for the fn are provided.
// // moarrrr functional would be to compose it...
// // findIndicators = (startEnd) => page => commentType => {}
// // findIndicators(start/end)(page)(commentType) // usage
// // Man... I fucking love this shit. Can't wait to get more time to code!
// // For realz man. It is addictive!
// // hahaha
// // lmao
// // I think that's why I avoided doing that initially. One traversal, grab all the infoz. Hell yeah it is!
// // You right, it is likely more efficient. :) But we are hyper-separating concerns.
// // -> increased reusability, scalability, and rockabilly
// // and this bitch ass shit gonna be clean as fuck... =D
// // This will seem redundant and kind of... not right.
// // But I promise it is... good. (idk a better word right now)
// // findIndicators(fileLines, commentType)
// // findStartIndicators(fileLines, commentType)
// // -> [{ startPosition: number, blockName: string }, { startPosition: number, blockName: string }]
// // findEndIndicators(fileLines, commentType)
// // -> [{ endPosition: number, blockName: string }, { endPosition: number, blockName: string }]
// //
// // So findIndicators will be given the shit it needs.
// // It will run findStartIndicators, which will return its findings.
// // Then it will run findEndIndicators, which will return its findings.
// // (Yes, we are iterating the entire array 2 times for this.)
// // I'ma write this shit real quick. Then I'm gonna delete it and let you go at it, haha.
// // [{ startPosition: number, blockName: string, endPosition: number }, { startPosition: number, blockName: string, endPosition: number }]
// const mergeIndicators = (starts, ends) => {
//     return starts.map(indicator => {
//         return {
//             ...indicator,
//             endPosition: ends.find(_indicator => {
//                 return _indicator.blockName === indicator.blockName
//             })[0]
//         }
//     })
// }
// const findStartIndicators = (lines, commentType) => {
//     return lines.map((line, i) => {
//         return line.includes('swapple start')
//             ? { startPosition: i, blockName: getBlockName(line) }
//             : false
//     }).filter(Boolean) // ;) removes any array items that are just false
// }// That's awesome!
// const getBlockName = (line) => {
//     // TODO: Handle bullshit after swapple block name. :)
//     const wordsInLine = line.split(' ') // dat law
//     return wordsInLine[wordsInLine.length - 1] // ### swapple start dispatch1a
// }
// const findEndIndicators = (lines, commentType) => {
//     return lines.map((line, i) => {
//         return line.includes('swapple end')
//             ? { startPosition: i, blockName: getBlockName(line) }
//             : false
//     }).filter(Boolean) // ;) removes any array items that are just false
// }// That's awesome!
// const findBlocksOrSomeShit = (lines, commentType) => {
//     const startIndicators = findStartIndicators(lines, commentType)
//     const endIndicators = findEndIndicators(lines, commentType)
//     const blocks = mergeIndicators(startIndicators, endIndicators)
//     // [{ startPosition: number, blockName: string, endPosition: number }, { startPosition: number, blockName: string, endPosition: number }]
//     return blocks
// } // Lol, I was planning on doing quite a bit of refactoring. I'll take the ideas and get my own code out tho.
// // It'll be a good exercise.
// // Man, fuck. This would change your whole API, haha. it would require the rest of your app to be rewritten.
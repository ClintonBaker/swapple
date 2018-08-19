# Swapple

A cli tool for toggling blocks of code on or off using comments.

## Installation

```
npm i -g swapple
```

## Usage

Wrap the blocks of code you want to make swappable with a comment
followed by start blockName and then end it with a comment and the keyword
end.

### Example

```
// start Production
let code = 'production';
// end
```

or

```
# start Production
let code = 'production';
# end
```

Then to toggle blocks of code on or off just use swapple!

```
swapple test.js
```

or

```
swapple ./path/to/my/file.js
```

## Development

```
npm i
npm run build
npm i -g ./
```

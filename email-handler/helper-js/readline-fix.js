// from https://stackoverflow.com/questions/41314556/readline-in-nodejs-is-drawing-unwanted-lines
// see  https://github.com/nodejs/node/blob/v16.5.0/lib/readline.js

//const { StringPrototypeSlice } = primordials


module.exports = function(c) {
  if (this.cursor < this.line.length) {
    const beg = StringPrototypeSlice(this.line, 0, this.cursor)
    const end = StringPrototypeSlice(this.line, this.cursor, this.line.length)
    this.line = beg + c + end
    this.cursor += c.length
    this._refreshLine()
  } else {
    this.line += c
    this.cursor += c.length
    this.output.write(c)
    this._moveCursor(0)
  }
}


// Interface.prototype._insertString = function(c) {
//   if (this.cursor < this.line.length) {
//     const beg = StringPrototypeSlice(this.line, 0, this.cursor)
//     const end = StringPrototypeSlice(this.line, this.cursor, this.line.length)
//     this.line = beg + c + end
//     this.cursor += c.length
//     this._refreshLine()
//   } else {
//     this.line += c
//     this.cursor += c.length
//     if (this.getCursorPos().cols === 0) {
//       this._refreshLine()
//     } else {
//       this._writeToOutput(c)
//     }
//   }
// }
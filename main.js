const fs = require("fs")
const parser = require("fast-xml-parser")
const path = require("path")
const yargs = require("yargs")
const { help } = require("yargs")

function parseSavefile(pathname) {
  try {
    const data = fs.readFileSync(pathname, {
      encoding: "utf8",
    })
    return parser.parse(data)
  } catch (err) {
    console.error(err)
  }
}

yargs
  .command(
    "load [savefile]",
    "load in a savefile",
    (yargs) => {
      yargs.positional("savefile", {
        type: "string",
        describe: "The pathname of your savefile",
      })
    },
    function (argv) {
      console.log(parseSavefile(argv.savefile))
    }
  )
  .help().argv

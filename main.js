const fs = require("fs/promises")
const parser = require("fast-xml-parser")
const path = require("path")
const yargs = require("yargs")

const { switchHost } = require("./lib/player")

const XmlParser = parser.j2xParser
let filePath

async function overwriteSavefile(data) {
  const Parser = new XmlParser()
  try {
    const xml = Parser.parse({ SaveGame: data })

    await fs.writeFile(`${filePath}-new`, xml, { encoding: "utf-8" })
  } catch (err) {
    console.error(err)
  }
}

async function doSwitchHost(argv) {
  const savedata = await parseSavefile(argv.savefile)
  const editedSave = switchHost(argv.name, savedata)
  await overwriteSavefile(editedSave)
  console.log(`Host changed to ${argv.name}!`)
}

async function parseSavefile(pathname) {
  filepath = pathname

  try {
    await fs.copyFile(pathname, `${pathname}_backup`)
    const data = await fs.readFile(pathname, {
      encoding: "utf8",
    })

    return parser.parse(data)?.SaveGame
  } catch (err) {
    console.error(err)
  }
}

yargs
  .command(
    "host [name] [savefile]",
    "Make someone the host",
    (yargs) => {
      yargs.positional("savefile", {
        type: "string",
        describe: "The pathname of your savefile",
      })
    },
    async function (argv) {
      doSwitchHost(argv)
    }
  )
  .help().argv

function switchHost(playerName, savegame) {
  const editedSave = savegame
  const { player } = savegame
  const locations = savegame.locations?.GameLocation || []
  if (player.name.toLowerCase() === playerName.toLowerCase()) {
    console.log(`${playerName} is already the host!`)
    return
  }

  const farmLocationIdx = locations.findIndex((l) => l.name === 'Farm')
  const buildings = locations[farmLocationIdx]?.buildings?.Building || []
  const cabins = buildings.filter((b) => /cabin$/gi.test(b.buildingType))

  if (cabins.length === 0) {
    throw new Error("You don't have any farmhands!")
  }

  const farmhandCabinIdx = cabins.findIndex(
    (c) => c.indoors?.farmhand?.name === playerName
  )
  const farmhandCabin = cabins[farmhandCabinIdx]

  if (farmhandCabin === null) {
    throw new Error(`Couldn't find a farmhand with the name ${playerName}!`)
  }

  editedSave.player = farmhandCabin?.indoors?.farmhand
  editedSave.locations.GameLocation[farmLocationIdx].buildings.Building[
    farmhandCabinIdx
  ].indoors.farmhand = player
  return editedSave
}

module.exports = { switchHost }

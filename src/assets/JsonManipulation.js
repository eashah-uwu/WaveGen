import { Tile } from "../Components/AdjacencySketches/Tiles";
import { mod } from "../Components/UI/ConnectionCard";

export const getTileImages = (tileSet) => {
  let tiles = {};
  let names = Object.keys(tileSet);
  for (let i = 0; i < names.length; i++) {
    let n = names[i];
    tiles[n] = { img: tileSet[n].img, bias: tileSet[n].bias, matches: [{}, {}, {}, {}]};
  }
  return tiles;
};

const isSameConnection = (connection1, connection2) => {
  return (
    connection1 === connection2 ||
    (connection1[0] === connection2[1] && connection1[1] === connection2[0]) ||
    (connection1[0] === connection2[0] && connection1[1] === connection2[1])
  );
};

export const extractConnectionsAndTiles = (json, width, height) => {
  console.log("Extracting")
  let names = Object.keys(json);
  let tilesToReturn = makeTileObjects(getTileImages(json), width, height);
  let connectionsToReturn = [];

  for (let i = 0; i < names.length; i++) {
    let name0 = names[i];
    let matches = json[name0].matches;
    if (!matches) continue;
    let i0 = tilesToReturn.findIndex((tile) => tile.name === name0);
    let tile0 = tilesToReturn[i0];
    for (let d = 0; d < 4; d++) {
      let Dnames = Object.keys(matches[d]);
      let direction0 = d;
      let connection0 = tile0.connections[direction0];
      for (let dN = 0; dN < Dnames.length; dN++) {
        let name1 = Dnames[dN];
        let i1 = tilesToReturn.findIndex((tile) => tile.name === name1);
        let tile1 = tilesToReturn[i1];
        let orientations = matches[d][name1];
        for (let o = 0; o < orientations.length; o++) {
          let direction1 = mod(-orientations[o] + direction0 - 2, 4);
          let connection1 = tile1.connections[direction1];
          connectionsToReturn.push([connection0, connection1]);
        }
      }
    }
  }

  let filteredConnections = [];
  for (let i = 0; i < connectionsToReturn.length; i++) {
    let sameFound = false;
    for (let n = 0; n < filteredConnections.length; n++) {
      sameFound = isSameConnection(
        connectionsToReturn[i],
        filteredConnections[n]
      );
      if (sameFound) break;
    }
    if (!sameFound) filteredConnections.push(connectionsToReturn[i]);
  }

  return [tilesToReturn, filteredConnections];
};

export const makeTileObjects = (tileImages, width, height) => {
  let newTiles = [];
  let names = Object.keys(tileImages);
  let step = Math.min(width, height) / 10;
  let tileX = step;
  let tileY = step;
  let tileSize = Math.min(width, height) / 7.5;
  for (let i = 0; i < names.length; i++) {
    newTiles.push(
      new Tile(names[i], tileImages[names[i]], tileX, tileY, tileSize)
    );
    tileX += tileSize + step;
    if (tileX + tileSize + step >= width) {
      tileX = step;
      tileY += tileSize + step;
    }
  }
  return newTiles;
};

export const downloadJSON = (json, filename) => {
  const data = JSON.stringify(json)
  const blob = new Blob([data], {type: 'application/json'})

  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `${filename}.json`

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const connectTiles = (tiles, connections) => {

  let toReturn = JSON.parse(JSON.stringify(tiles))
  
  for (let i = 0; i < connections.length; i++) {
    //names of tiles of both side
    let name0 = connections[i][0].parent.name;
    let name1 = connections[i][1].parent.name;

    let direction0 = connections[i][0].direction;
    let direction1 = connections[i][1].direction;

    let matches0 = toReturn[name0].matches;
    let matches1 = toReturn[name1].matches;

    if (!matches0[direction0][name1]) matches0[direction0][name1] = [];
    matches0[direction0][name1].push(mod(direction0 - direction1 + 2, 4));
    if (connections[i][0] !== connections[i][1]) {
      if (!matches1[direction1][name0]) matches1[direction1][name0] = [];
      matches1[direction1][name0].push(mod(direction1 - direction0 + 2, 4));
    }
  }
  return toReturn;
};

import { sketch } from "../ConnectionSketches/sketch";
import React, { useEffect, useMemo, useState } from "react";
import ConnectionCard from "../UI/ConnectionCard";
import {
  connectTiles,
  downloadJSON,
  getTileImages,
  makeTileObjects,
} from "../../assets/JsonManipulation";
import "../../Styles/Backgrounds.css";
import { ConnectingBoard } from "../ConnectionSketches/ConnectingBoard";

const simplifyConnections = (Connections) => {
  return Connections.map((connection) => [
    {
      parentName: connection[0].parent.name,
      direction: connection[0].direction,
    },
    {
      parentName: connection[1].parent.name,
      direction: connection[1].direction,
    },
  ]);
};

const getConnectionsAndTiles = (json, width, height) => {
  let simpleConnections = json.settings.connections;
  let tilesObject = {};
  let Tiles = makeTileObjects(json.tileSet, width, height);
  for (let t = 0; t < Tiles.length; t++) {
    let T = Tiles[t];
    tilesObject[T.name] = T;
  }

  let Connections = simpleConnections.map((c) => [
    tilesObject[c[0].parentName].connections[c[0].direction],
    tilesObject[c[1].parentName].connections[c[1].direction],
  ]);
  return [Tiles, Connections];
};

const getFinalJson = (json, Connections) => {
  return {
    settings: {
      ...json.settings,
      connections: simplifyConnections(Connections),
    },
    tileSet: connectTiles(getTileImages(json.tileSet), Connections),
  };
};

export const ConnectionPage = ({ json, changeState, setJson, filename }) => {
  const [filtering, setFiltering] = useState(false);
  const [filteredTile, setFilteredTile] = useState("");
  const [allConnections, setAllConnections] = useState([]);
  const [Tiles, setTiles] = useState([]);
  const [connections, setConnections] = useState([]);
  const [hoverConnection, setHoverConnection] = useState(null);
  const [page, setPage] = useState(0);
  const width = window.innerHeight * (16/9) * 0.75 - 64;
  const height = window.innerHeight - 80;

  const bgColor = "#0f0f0f";

  const filterConnections = (tileName) => {
    setFiltering(true);
    setFilteredTile(tileName);
    setConnections(
      allConnections.filter((connection, i) => {
        if (
          connection[0].parent.name === tileName ||
          connection[1].parent.name === tileName
        ) {
          return true;
        } else return false;
      })
    );
  };

  const addConnection = (connection) => {
    let tileName = filteredTile;
    setAllConnections((c) => [connection, ...c]);
    let filter =
      tileName === "" ||
      (tileName !== "" &&
        (connection[0].parent.name === tileName ||
          connection[1].parent.name === tileName));
    if (filter) {
      setConnections((c) => [connection, ...c]);
    }
  };

  useEffect(() => {
    if (!filtering) {
      setConnections(allConnections);
    }
    setPage(0);
  }, [filtering]);

  useEffect(() => {
    let extraction = getConnectionsAndTiles(json, width, height);
    let c = extraction[1];
    let t = extraction[0];
    setTiles(t);
    setConnections(c);
    setAllConnections(c);
  }, [json]);

  const clearConnections = (tileName) => {
    setAllConnections(
      allConnections.filter((connection, i) => {
        return !(
          connection[0].parent.name === tileName ||
          connection[1].parent.name === tileName
        );
      })
    );
  };

  const isSameConnection = (c1, c2) => {
    console.log(c1, c2);
    let result =
      (c1[0].parent.name === c2[0].parent.name &&
        c1[0].direction === c2[0].direction &&
        c1[1].parent.name === c2[1].parent.name &&
        c1[1].direction === c2[1].direction) ||
      (c1[0].parent.name === c2[1].parent.name &&
        c1[0].direction === c2[1].direction &&
        c1[1].parent.name === c2[0].parent.name &&
        c1[1].direction === c2[0].direction);
    console.log(result);
    return result;
  };

  const displayConnections = useMemo(
    () =>
      connections.slice(page * 6, (page + 1) * 6).map((connection) => (
        <ConnectionCard
          connection={connection}
          key={`${connection[0].parent.name}[${connection[0].direction}]<->${connection[1].parent.name}[${connection[1].direction}]`}
          deleteConnection={() => deleteConnection(connection)}
          setHover={(index) => {
            if (index !== undefined) setHoverConnection(index);
            else setHoverConnection(connection);
          }}
          filter={filterConnections}
          bla={console.log(page)}
        />
      )),
    [connections, page]
  );

  const deleteConnection = (connection) => {
    let i = 0;
    for (i = 0; i < allConnections.length; i++) {
      if (isSameConnection(allConnections[i], connection)) {
        break;
      }
    }
    if (i !== allConnections.length) {
      allConnections.splice(i, 1);
    }
    setAllConnections([...allConnections]);

    for (i = 0; i < connections.length; i++) {
      if (isSameConnection(connections[i], connection)) {
        break;
      }
    }
    if (i !== connections.length) {
      connections.splice(i, 1);
    }
    setConnections([...connections]);
  };

  return (
    <div className="h-screen aspect-video flex p-8 justify-center gap-6 text-2xl">
      <ConnectingBoard
        sketch={sketch}
        width={width}
        height={height}
        Tiles={Tiles}
        connections={connections}
        addConnection={addConnection}
        hoverConnection={hoverConnection}
        bgColor={bgColor}
      />
      <div className="flex flex-col flex-1 gap-2 justify-between">
        <div
          className="flex flex-col rounded-3xl p-4 justify-between"
          style={{ backgroundColor: bgColor }}
        >
          <div
            className={`flex flex-col py-2 px-4 gap-2 text-white justify-center`}
          >
            <div className="flex justify-between items-center">
              <button
                className="hover:scale-125 bg-neutral-900 p-1 rounded-lg"
                onClick={() => {
                  if ((page - 1) * 6 >= 0) setPage(page - 1);
                }}
              >
                <svg
                  className="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>chevron-left</title>
                  <path
                    d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
              <h1 className="text-2xl text-center font-playfair select-none">
                Connections
              </h1>
              <button
                className="hover:scale-125 bg-neutral-900 p-1 rounded-lg"
                onClick={() => {
                  if ((page + 1) * 6 < connections.length) setPage(page + 1);
                }}
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <title>chevron-right</title>
                  <path
                    d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
            {filtering && (
              <div className="flex justify-between">
                <button
                  className="text-sm opacity-25 hover:opacity-50 underline"
                  onClick={() => {
                    setFiltering(false);
                    clearConnections(filteredTile);
                  }}
                >
                  Remove All Connections
                </button>
                <button
                  className="text-sm opacity-25 hover:opacity-50 underline"
                  onClick={() => {
                    setFiltering(false);
                  }}
                >
                  Clear Filter
                </button>
              </div>
            )}
          </div>
          <div className="flex flex-1">
            <div className="flex flex-1 flex-col gap-2 p-4 h-[72vh] overflow-y-auto">
              {displayConnections}
            </div>
          </div>

          {connections.length !== 0 && (
            <p className="text-center flex gap-2 w-full justify-center text-neutral-400 text-lg">
              {"Page"}
              <span>
                <input
                  className="w-6 text-center rounded-md bg-neutral-800 outline-none"
                  type="text"
                  value={page + 1}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val <= Math.ceil(connections.length / 6) && val !== 0)
                      setPage(val - 1);
                  }}
                />
              </span>
              {` of ${Math.ceil(connections.length / 6)}`}
            </p>
          )}
        </div>
        <div className="flex rounded-3xl gap-2 items-center">
          <button
            className="primary-button bg-opacity-75 p-2 hover:scale-105 hover:bg-opacity-100"
            onClick={() => {
              setJson(getFinalJson(json, allConnections));
              changeState("DRAWING");
            }}
          >
            <svg
              className="h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>arrow-left</title>
              <path
                d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            className="primary-button bg-opacity-75 p-2 hover:scale-105 hover:bg-opacity-100"
            onClick={() =>
              downloadJSON(getFinalJson(json, allConnections), filename)
            }
          >
            <svg
              className="h-10 w-10"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <title>content-save-outline</title>
              <path
                d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3M19 19H5V5H16.17L19 7.83V19M12 12C10.34 12 9 13.34 9 15S10.34 18 12 18 15 16.66 15 15 13.66 12 12 12M6 6H15V10H6V6Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <button
            className="primary-button font-playfair p-4 flex-1 text-2xl"
            onClick={() => {
              setJson(getFinalJson(json, allConnections));
              changeState("GENERATING");
            }}
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

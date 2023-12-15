import { useEffect, useState } from "react";
import { TileCard } from "../UI/TileCard";
import { GeneratingBoard } from "../GenerationSketches/GeneratingBoard";
import { SettingSlider } from "../UI/SettingSlider";
import { Checkbox } from "../UI/Checkbox";
import { downloadJSON } from "../../assets/JsonManipulation";
import '../../Styles/Backgrounds.css'

export const GenerationPage = ({ tilesJson, changeState, setJson: updateJson, filename }) => {
  const [json, setJson] = useState(tilesJson);
  const [tiles, setTiles] = useState([]);
  const [tilesDisplay, setTilesDisplay] = useState([])
  const [placingTile, setPlacingTile] = useState(null)

  const [boardDimension, setBoardDimension] = useState(8)
  const [showAnimation, setShowAnimation] = useState(true)
  const [showBacktracking, setShowBacktracking] = useState(false)
  const [paused, setPaused] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(10)
  const [callbackWord, setCallbackWord] = useState("NONE") 

  console.log(tilesJson)  

  useEffect(() => {
    const tiles = [];
    const names = Object.keys(tilesJson.tileSet);
    for (let i = 0; i < names.length; i++) {
      tiles.push({ name: names[i], tile: tilesJson.tileSet[names[i]] });
    }
    setTiles(tiles);
  }, [tilesJson]);

  const setBias = (name, value) => {
    if (value === 0 || json.tileSet[name].bias === 0) {
      setCallbackWord("CLEAR FIXED"); 
      setPlacingTile(null)
    }
    json.tileSet[name].bias = value;
    setJson(json);
  };

  useEffect(() => {
    setTilesDisplay(tiles.map((tileObject) => (
      <TileCard
        tileObject={tileObject}
        value={json.tileSet[tileObject.name].bias}
        onUpdate={(value) => {setBias(tileObject.name, value)}}
        setToPlace={(name) => setPlacingTile(name)}
        highlight={placingTile === tileObject.name}
      />
    )))
  }, [tiles, json, placingTile])
  
  useEffect(() => {
    setCallbackWord("ANIMATION")
  }, [showAnimation])
  
  useEffect(() => {
    setCallbackWord("BACKTRACKING")
  }, [showBacktracking])

  useEffect(() => {
    setCallbackWord("PAUSE/PLAY")
  }, [paused])
  
  useEffect(() => {
    setCallbackWord("NONE")
  }, [callbackWord])

  return (
    <div className="flex h-full aspect-video items-center justify-center gap-4">
      <div className="font-sans flex flex-col justify-evenly p-4 bg-neutral-900 rounded-2xl h-4/5 w-72">
        <div className="flex items-center">
          <button className="bg-neutral-800 text-white rounded-md bg-opacity-75 p-2 hover:scale-105 hover:bg-opacity-100" onClick={() => {changeState("CONNECTING"); updateJson(json)}}>
              <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" fill="currentColor"/></svg>
          </button>
          <p className="flex-1 text-center text-white text-2xl font-playfair">Settings</p>
          <button className="bg-neutral-800 text-white rounded-md bg-opacity-75 p-2 hover:scale-105 hover:bg-opacity-100" onClick={() => {changeState("DRAWING"); updateJson(json)}}>
            <svg className="h-10 w-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>palette-outline</title><path d="M12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2C17.5,2 22,6 22,11A6,6 0 0,1 16,17H14.2C13.9,17 13.7,17.2 13.7,17.5C13.7,17.6 13.8,17.7 13.8,17.8C14.2,18.3 14.4,18.9 14.4,19.5C14.5,20.9 13.4,22 12,22M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20C12.3,20 12.5,19.8 12.5,19.5C12.5,19.3 12.4,19.2 12.4,19.1C12,18.6 11.8,18.1 11.8,17.5C11.8,16.1 12.9,15 14.3,15H16A4,4 0 0,0 20,11C20,7.1 16.4,4 12,4M6.5,10C7.3,10 8,10.7 8,11.5C8,12.3 7.3,13 6.5,13C5.7,13 5,12.3 5,11.5C5,10.7 5.7,10 6.5,10M9.5,6C10.3,6 11,6.7 11,7.5C11,8.3 10.3,9 9.5,9C8.7,9 8,8.3 8,7.5C8,6.7 8.7,6 9.5,6M14.5,6C15.3,6 16,6.7 16,7.5C16,8.3 15.3,9 14.5,9C13.7,9 13,8.3 13,7.5C13,6.7 13.7,6 14.5,6M17.5,10C18.3,10 19,10.7 19,11.5C19,12.3 18.3,13 17.5,13C16.7,13 16,12.3 16,11.5C16,10.7 16.7,10 17.5,10Z" fill="currentColor"/></svg>
          </button>
        </div>
        <div className="bg-neutral-800 text-white rounded-xl">
          <SettingSlider label={"Grid Size"} value={boardDimension} onUpdate={setBoardDimension} min={5} max={40} step={1} />
        </div>
        <Checkbox label={"Show Backtracking"} value={showBacktracking} onUpdate={setShowBacktracking} />
        <Checkbox label={"Show Animation"} value={showAnimation} onUpdate={setShowAnimation} />
        <div className="bg-neutral-800 text-white rounded-xl">
          <SettingSlider label={"Animation Speed"} value={animationSpeed} onUpdate={setAnimationSpeed} min={0} max={20} step={1} />
        </div>

        <div className="flex bg-neutral-800 rounded-xl p-2 gap-2 text-white justify-center items-center">
          <button onClick={() => setCallbackWord("RESTART")}>
            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>skip-backward</title><path d="M20,5V19L13,12M6,5V19H4V5M13,5V19L6,12" fill="currentColor"/></svg>
          </button>

          <button onClick={() => setCallbackWord("REWIND")}>
            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>rewind</title><path d="M11.5,12L20,18V6M11,18V6L2.5,12L11,18Z" fill="currentColor"/></svg>
          </button>

          <button onClick={() => setPaused(!paused)}>
            { paused ?
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>play</title><path d="M8,5.14V19.14L19,12.14L8,5.14Z" fill="currentColor"/></svg> :
              <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pause</title><path d="M14,19H18V5H14M6,19H10V5H6V19Z" fill="currentColor"/></svg>
            }
          </button>

          <button onClick={() => setCallbackWord("SKIP")}>
            <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>fast-forward</title><path d="M13,6V18L21.5,12M4,18L12.5,12L4,6V18Z" fill="currentColor"/></svg>
          </button>

          <button onClick={() => setCallbackWord("END")}>
          <svg className="h-8 w-8" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>skip-forward</title><path d="M4,5V19L11,12M18,5V19H20V5M11,5V19L18,12" fill="currentColor"/></svg>
          </button>
        </div>

        {!placingTile &&<button className="primary-button p-4 font-playfair text-xl" onClick={() => setCallbackWord("CLEAR")}>
          Clear Board
        </button>}
        
        {placingTile &&<button className="primary-button p-4 font-playfair text-xl" onClick={() => setCallbackWord("CLEAR FIXED")}>
          Clear Fixed Tile
        </button>}

        <button className="primary-button p-4 text-xl font-playfair" onClick={() => downloadJSON(json, filename)}>
          Save JSON
        </button>

      </div>

      <div className="flex justify-center">
        <GeneratingBoard json={json.tileSet} boardDimension={boardDimension} animationSpeed={animationSpeed-10} callbackWord={callbackWord} fixedTile={placingTile}/>
      </div>

      <div className="flex flex-col gap-4 h-4/5 w-72">
        <div className="bg-neutral-900 flex-1 rounded-2xl grid grid-cols-2 p-4 gap-4 overflow-y-auto">
          {tilesDisplay}
        </div>
        <button className="primary-button p-4 text-xl font-playfair" onClick={() => setCallbackWord("SAVE")}>
          Save Image
        </button>
      </div>
    </div>
  );
};

import { useEffect, useState } from "react";
import '../../Styles/Backgrounds.css'
import { SketchPicker } from "react-color";
import { DrawingBoard } from "../DrawingSketches/DrawingBoard";
import { TileImg } from "../UI/TileImg";
import { downloadJSON } from "../../assets/JsonManipulation";
import {v4 as randomID} from "uuid"
// import { driver } from "driver.js"
// import 'driver.js/dist/driver.css'

export const DrawingPage = ({changeState, json, setJson, filename}) => {
  const [defaultColor, setDefaultColor] = useState(json.settings.defaultColor)
  const [selectedColor, setSelectedColor] = useState("#000000")
  const [tiles, setTiles] = useState([])
  const [tilesDisplay, setTilesDisplay] = useState([])
  const [img, setImg] = useState(null)
  const [drawingColor, setDrawingColor] = useState(selectedColor)
  const [workingJson, setWorkingJson] = useState(json)
  const [editingTile, setEditingTile] = useState("")
  const [pallete, setPallete] = useState(['#D0021B', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE', '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#FFFFFF', json.settings.defaultColor])
  const [callBack, setCallBack] = useState("NONE")
  const [grid, setGrid] = useState(false)

  // const driverObj = driver({
  //   showProgress: true,
  //   steps: [
  //     { 
  //       element: '#drawingBoard', 
  //       popover: { 
  //         title: 'Drawing Board', 
  //         description: 'Here you can create your own custom Tiles', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#controlPanel', 
  //       popover: { 
  //         title: 'Control Panel', 
  //         description: 'This contains all the required tools to make Tiles', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#drawPen', 
  //       popover: { 
  //         title: 'Pen Tool', 
  //         description: 'Use this to set the drawing color to the last picked color',
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#eraser', 
  //       popover: { 
  //         title: 'Eraser', 
  //         description: 'Use this to set the drawing color to the Tile color',
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#fill', 
  //       popover: { 
  //         title: 'Fill Tool', 
  //         description: 'Use this to fill the entire board with the selected color and change the color of the eraser', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#colorPicker', 
  //       popover: { 
  //         title: 'Color Picker', 
  //         description: 'Use this to chose any desired color from the board', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#gridButton', 
  //       popover: { 
  //         title: 'Toggle Grid', 
  //         description: 'Use this to toggle the grid lines', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#clear', 
  //       popover: { 
  //         title: 'Clear Grid', 
  //         description: 'Use this to clear the entire drawing board', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#addTile', 
  //       popover: { 
  //         title: 'Add Tile', 
  //         description: 'Use this to add and save your drawing to the Tileset', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#tilesDisplay', 
  //       popover: { 
  //         title: 'TileSet', 
  //         description: 'This contains all the Tiles that you have created', 
  //         side: "right", 
  //         align: 'start',
  //       }
  //     },
  //     { 
  //       element: '#generatingPage', 
  //       popover: { 
  //         title: 'Generation Page', 
  //         description: 'Use this later to jump to the generation page', 
  //         side: "left", 
  //         align: 'start',
  //       }
  //     },


  //   ]
  // });

  // useEffect(() => {
  //   driverObj.drive()
  // }, [])

  const updateRecent = (color) => {
    let otherColors = pallete.filter(c => c !== color)
    if (otherColors.length === pallete.length) otherColors.splice(-1, 1)
      setPallete([color, ...otherColors])
  }
  
  const deleteFromJSON = (tileName) => {
    if (!workingJson.tileSet[tileName]) return
    delete workingJson.tileSet[tileName]
    let names = Object.keys(workingJson.tileSet)
    for (let n = 0; n < names.length; n++) {
      let tile = workingJson.tileSet[names[n]]
      if (!tile.matches) continue;  
      for (let d = 0; d < 4; d++) {
        delete tile.matches[d][tileName]
      }
    }
    setWorkingJson(JSON.parse(JSON.stringify(workingJson)))
  }

  const generateJSON = () => {
    console.log(tiles)
    for (let t = 0; t < tiles.length; t++) {
      let tile = tiles[t]
      if (!workingJson.tileSet[tile.name]) {
        workingJson.tileSet[tile.name] = {img: tile.img, bias: 1, matches: [{}, {}, {}, {}]}
      }
    }
    workingJson.settings.defaultColor = defaultColor
    setWorkingJson(JSON.parse(JSON.stringify(workingJson)))
    setJson(workingJson)
    return workingJson
  }

  const saveJSON = () => {
    downloadJSON(generateJSON(), filename)
  }

  useEffect(() => {
    let names = Object.keys(workingJson.tileSet)
    const t = []
    for (let n = 0; n < names.length; n++) {
      t.push({name: names[n], img: workingJson.tileSet[names[n]].img})
    }
    setTiles(t)
  }, [workingJson]) 

  useEffect(() => {
    setTilesDisplay(tiles.map((tile, i) => (
      <div className="relative h-32 w-32 border-2 border-black group">
        <button className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 h-7 w-7 p-1 text-white opacity-0 group-hover:opacity-70 bg-red-600 rounded-full border-black border-2 group-hover:hover:opacity-100" onClick={(e) => {setTiles(t => t.filter(tile => tile !== tiles[i])); e.stopPropagation(); deleteFromJSON(tile.name)}}>
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Delete</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/></svg>
        </button>
        <div className="absolute left-0 top-0 h-full w-full p-1 rounded-3xl opacity-0 group-hover:opacity-100 overflow-hidden">
          <button className="h-full w-1/2 p-2 text-white opacity-30 bg-neutral-800 border-black border-2 group-hover:hover:opacity-75" onClick={() => {setImg(tile.img); setEditingTile(tile.name)}}>
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>pencil</title><path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" fill="currentColor"/></svg>
          </button>
          <button className="h-full w-1/2 p-2 text-white opacity-30 bg-neutral-800 border-black border-2 group-hover:hover:opacity-75" onClick={() => {setImg(tile.img); setEditingTile("")}}>
            <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>content-copy</title><path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" fill="currentColor"/></svg>
          </button>
        </div>
        <TileImg img={tile.img} />
      </div>
    )))
  }, [tiles])

  useEffect(() => {
    updateRecent(selectedColor)
  }, [selectedColor])
  
  useEffect(() => {
    setCallBack("NONE")
  }, [callBack])
  
  useEffect(() => {
    setImg(null)
  }, [img])

  const addTile  = (img) => {

    if (editingTile === "") {
      let newName = randomID()
      let tile = {name: newName, img}
      setTiles(t => [tile, ...t])
    } else {
      setTiles(t => [...t.map(tile => tile.name !== editingTile ? tile : {name: tile.name, img})])
      if (workingJson.tileSet[editingTile]) {
        workingJson.tileSet[editingTile].img = img
        setWorkingJson(workingJson)
      }
      setEditingTile("")
    }
  }

  return (
    <div className="flex h-full aspect-video justify-center items-center font-playfair">
      <div className="flex h-fit justify-center items-center gap-8">

        <div id="tilesDisplay" className="bg-white flex-1 flex flex-col items-center p-2 rounded-2xl h-[80vh] overflow-hidden">
          <h1 className="text-4xl text-black w-72 text-center">Tiles</h1>
          <div className="grid gap-4 p-4 w-fit grid-cols-2 justify-center overflow-y-auto overflow-x-hidden">
            {tilesDisplay}
          </div>
        </div>

        <div className="h-full aspect-square flex justify-center items-center" id="drawingBoard">
          <DrawingBoard 
          size={workingJson.settings.tileSize} 
          selectedColor={selectedColor} 
          defaultColor={defaultColor} 
          callBackWord={callBack}
          addTile={addTile}
          img={img}
          setSelectedColor={(color)=> {setSelectedColor(color); setDrawingColor(color)}}
          />
        </div>

        <div className="flex h-full flex-col gap-2 rounded-2xl justify-between">
          <div className="flex items-center p-4 rounded-2xl bg-white">
            <button className="bg-neutral-100 text-black rounded-md p-2 hover:scale-105 hover:bg-neutral-200" onClick={() => {changeState("STARTING"); generateJSON()}}>
                <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" fill="currentColor"/></svg>
            </button>
            <p className="flex-1 text-center text-black text-xl font-playfair">Drawing</p>
          </div>
            <div id="controlPanel" className="flex flex-col gap-4 p-4 rounded-2xl font-mono text-black" style={{backgroundColor: selectedColor}}>
              <SketchPicker presetColors={pallete} color={selectedColor} onChangeComplete={(color) => {setSelectedColor(color.hex)}} />
              <div className="flex flex-col gap-2">

                <div className="w-full flex px-2 justify-between">
                  <button id="drawPen"  className="p-2 rounded-full bg-neutral-100 hover:scale-110 hover:bg-neutral-200 border border-black" onClick={() => setSelectedColor(drawingColor)}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>lead-pencil</title><path d="M16.84,2.73C16.45,2.73 16.07,2.88 15.77,3.17L13.65,5.29L18.95,10.6L21.07,8.5C21.67,7.89 21.67,6.94 21.07,6.36L17.9,3.17C17.6,2.88 17.22,2.73 16.84,2.73M12.94,6L4.84,14.11L7.4,14.39L7.58,16.68L9.86,16.85L10.15,19.41L18.25,11.3M4.25,15.04L2.5,21.73L9.2,19.94L8.96,17.78L6.65,17.61L6.47,15.29" /></svg>
                  </button>
                  <button id="eraser" className="p-2 rounded-full bg-neutral-100 hover:scale-110 hover:bg-neutral-200 border border-black" onClick={() => {setDrawingColor(selectedColor); setSelectedColor(defaultColor)}}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>eraser</title><path d="M16.24,3.56L21.19,8.5C21.97,9.29 21.97,10.55 21.19,11.34L12,20.53C10.44,22.09 7.91,22.09 6.34,20.53L2.81,17C2.03,16.21 2.03,14.95 2.81,14.16L13.41,3.56C14.2,2.78 15.46,2.78 16.24,3.56M4.22,15.58L7.76,19.11C8.54,19.9 9.8,19.9 10.59,19.11L14.12,15.58L9.17,10.63L4.22,15.58Z" /></svg>
                  </button>
                  <button id="fill" className="p-2 rounded-full bg-neutral-100 hover:scale-110 hover:bg-neutral-200 border border-black" onClick={() => {setCallBack("FILL"); setDefaultColor(selectedColor)}}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>format-color-fill</title><path d="M19,11.5C19,11.5 17,13.67 17,15A2,2 0 0,0 19,17A2,2 0 0,0 21,15C21,13.67 19,11.5 19,11.5M5.21,10L10,5.21L14.79,10M16.56,8.94L7.62,0L6.21,1.41L8.59,3.79L3.44,8.94C2.85,9.5 2.85,10.47 3.44,11.06L8.94,16.56C9.23,16.85 9.62,17 10,17C10.38,17 10.77,16.85 11.06,16.56L16.56,11.06C17.15,10.47 17.15,9.5 16.56,8.94Z" /></svg>
                  </button>
                  <button id="colorPicker" className="p-2 rounded-full bg-neutral-100 hover:scale-110 hover:bg-neutral-200 border border-black" onClick={() => setCallBack("SAMPLE")}>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>colorPicker</title><path d="M19.35,11.72L17.22,13.85L15.81,12.43L8.1,20.14L3.5,22L2,20.5L3.86,15.9L11.57,8.19L10.15,6.78L12.28,4.65L19.35,11.72M16.76,3C17.93,1.83 19.83,1.83 21,3C22.17,4.17 22.17,6.07 21,7.24L19.08,9.16L14.84,4.92L16.76,3M5.56,17.03L4.5,19.5L6.97,18.44L14.4,11L13,9.6L5.56,17.03Z" /></svg>
                  </button>
                </div>

                <div className="w-full flex px-2 justify-center items-center gap-2">
                  <button id="gridButton" className="bg-neutral-100 rounded-lg hover:scale-125 p-1 w-7 h-7" onClick={() => {setCallBack("GRID"); setGrid(!grid)}}>
                    {grid ?
                      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>grid-off</title><path d="M0,2.77L1.28,1.5L22.5,22.72L21.23,24L19.23,22H4C2.92,22 2,21.1 2,20V4.77L0,2.77M10,4V7.68L8,5.68V4H6.32L4.32,2H20A2,2 0 0,1 22,4V19.7L20,17.7V16H18.32L16.32,14H20V10H16V13.68L14,11.68V10H12.32L10.32,8H14V4H10M16,4V8H20V4H16M16,20H17.23L16,18.77V20M4,8H5.23L4,6.77V8M10,14H11.23L10,12.77V14M14,20V16.77L13.23,16H10V20H14M8,20V16H4V20H8M8,14V10.77L7.23,10H4V14H8Z" fill="currentColor"/></svg> :
                      <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>grid</title><path d="M10,4V8H14V4H10M16,4V8H20V4H16M16,10V14H20V10H16M16,16V20H20V16H16M14,20V16H10V20H14M8,20V16H4V20H8M8,14V10H4V14H8M8,8V4H4V8H8M10,14H14V10H10V14M4,2H20A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4C2.92,22 2,21.1 2,20V4A2,2 0 0,1 4,2Z" fill="currentColor"/></svg>
                    }
                  </button>
                  <button id="clear" className="text-sm p-1 rounded-lg flex-1 bg-neutral-100 hover:scale-110 hover:bg-neutral-200 border border-black" onClick={() => {setCallBack("CLEAR"); setEditingTile("")}}>
                    Clear
                  </button>
                  <button id="addTile" className="text-sm p-1 rounded-lg flex-1 bg-neutral-100 hover:scale-110 hover:bg-neutral-200 border border-black" onClick={() => setCallBack("SAVE")}>
                    {`${editingTile === "" ? "Add Tile" : "Save Tile"}`}
                  </button>
                  
                </div>

              </div>
            </div>
            <div className="flex flex-col gap-4">
              <button className="primary-button shadow-md hover:bg-black hover:text-white p-4 text-lg" onClick={() => {saveJSON()}}>Save JSON</button>
              <div className="w-full flex h-14 gap-2">
                <button className="primary-button shadow-md hover:bg-black hover:text-white px-8 text-lg" onClick={() => {generateJSON(); changeState("CONNECTING")}}>Connect Tiles</button>
                <button id="generatingPage" className="primary-button p-2" onClick={() => {generateJSON(); changeState("GENERATING")}}>
                  <svg className="h-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>image-edit-outline</title><path d="M22.7 14.3L21.7 15.3L19.7 13.3L20.7 12.3C20.8 12.2 20.9 12.1 21.1 12.1C21.2 12.1 21.4 12.2 21.5 12.3L22.8 13.6C22.9 13.8 22.9 14.1 22.7 14.3M13 19.9V22H15.1L21.2 15.9L19.2 13.9L13 19.9M11.21 15.83L9.25 13.47L6.5 17H13.12L15.66 14.55L13.96 12.29L11.21 15.83M11 19.9V19.05L11.05 19H5V5H19V11.31L21 9.38V5C21 3.9 20.11 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.11 3.9 21 5 21H11V19.9Z" /></svg>
                </button>
              </div>
              
            </div>
          </div>
      </div>
    </div>
  )
}

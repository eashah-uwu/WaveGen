import { useState } from "react"
import { SettingSlider } from "../UI/SettingSlider"
import { CompactPicker } from "react-color"

export const StartingPage = ({changeState, setJson, setFilename, json, filename, started=false, imported=false, setImported, setStarted}) => {

  const [importing, setImporting] = useState(imported)
  const [starting, setStarting] = useState(started)
  const [projectName, setProjectName] = useState(imported ? "" : filename)
  const [size, setSize] = useState(json.settings.tileSize)
  const [color, setColor] = useState(json.settings.defaultColor)
  const [error, setError] = useState(null)

  const parseFile = async (file) => {
    try {
      setError(null)
      let text = await file.text()
      let json = JSON.parse(text)
      setFilename(file.name.slice(0, file.name.length-5))
      setJson(json)
      changeState("GENERATING")
      setImported(true) 
      setStarted(false)
    } catch (e) {
      setError(e.message)
      setImporting(false)
    }
  }

  const updateJson = () => {
    setJson({
      settings: {
        tileSize: size, 
        defaultColor: color, 
        connections: [], 
      }, 
      tileSet: {}
    })
  }

  return (
    <>
    <div className="flex h-full aspect-video hue-rotate-[120deg] justify-center items-center">
      <div className="flex flex-col gap-4 bg-white text-black p-6 w-3/5 rounded-2xl">
        <div className="flex flex-col gap-4">
          {!starting && <>
          <h2 className="font-bold text-3xl font-playfair">{`${importing ? "Import Project": "Hello World!"}`}</h2>
          <p className="text-xl tracking-wide font-roboto">A small Lego piece can be used to create an entire world, limited only by the extent of your imagination. WaveGen allows the same possibility in the realm of graphics, providing an innovative and simple way for image generation</p>
          </>}

          {starting && <>
          <h2 className="font-bold text-3xl font-playfair">New Project</h2>
          <p className="text-xl tracking-wide font-roboto">To embark on this new journey, you need to define some rules. Rules that allow your creative world to have order, something to adhere by and some for the ease of use along the way. Be sure to give this project a fitting name.</p>
          </>}
          <div className="flex flex-col p-4 gap-4 bg-neutral-100 rounded-xl font-mono text-lg leading-tight">
            {!starting && <>
            <p><strong className="tracking-wider">Designing:</strong> Define the Lego pieces of your world. In this stage you challenge your creative prowess to the extreme. Ranging from basic designs to masterpieces, the possibilities are endless.</p>
            <p><strong className="tracking-wider">Connecting:</strong> A simple Lego piece will only get you so far. A structure comes to life with different pieces fitting together. Not all Lego pieces fit together; In the same way, you get to define how your designed Tiles fit together by defining how they connect.</p>
            <p><strong className="tracking-wider">Generating:</strong> Building a whole Lego world by hand takes weeks to perfect, however WaveGen makes this task effortless by taking your defined Tiles, enforcing the connections defined by you and generating a randomized image just with the click of a button. You can even pitch in the generation by predefining some Tiles to be included in your image.</p>
            </>}

            {starting && <>
            <p><strong className="tracking-wider">Project Name:</strong> Give a name to your project. This name will be used for the name of the file you get upon saving. So you can Import it later on!</p>
            <p><strong className="tracking-wider">Tile Size:</strong> Define the size of the Tile(s) you will be Designing. The dimension (in pixels) of the Tile.</p>
            <p><strong className="tracking-wider">Tile Color:</strong> The color each Tile will be filled with from the get-go. A background color per se.</p>
            </>}
          </div>
        </div>
        {!importing && !starting && <div className="flex w-full gap-4">
          <button className="primary-button p-4 text-xl font-playfair flex-1 hover:bg-black hover:text-white hover:scale-105 duration-300" onClick={() => setStarting(true)}>Start New Project</button>
          <button className="primary-button p-4 text-xl font-playfair flex-1 hover:bg-black hover:text-white hover:scale-105 duration-300" onClick={() => setImporting(true)}>Import Project</button>
        </div>}
        {importing && 
        <div className="flex gap-4 p-4 bg-neutral-100 text-black rounded-xl items-center">
          <button className="rounded-full p-1 bg-black text-white bg-opacity-75 hover:scale-105 hover:bg-opacity-100" onClick={() => setImporting(false)}>
            <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" fill="currentColor"/></svg>
          </button>
          <div className="flex flex-1 justify-between items-center">
          <p className="text-xl">{`${error ? error: "Please select a Valid JSON file to continue:"}`}</p>
          <input className="" type="file" accept=".json" onChange={(e) => parseFile(e.target.files[0])}/>
          </div>
        </div>}
        {starting &&
        <div className="flex gap-4 p-4 bg-neutral-100 text-black rounded-xl items-center">
          <button className="rounded-full p-1 bg-black text-white bg-opacity-75 hover:scale-105 hover:bg-opacity-100" onClick={() => setStarting(false)}>
            <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>arrow-left</title><path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z" fill="currentColor"/></svg>
          </button>
          <div className="flex flex-1 gap-4">
            <div className="flex flex-col gap-2 bg-white p-2 rounded-xl">
              <div className="flex p-2 justify-between items-center">
                <p className="text-black font-playfair text-xl">Tile Color:</p>
                <div className="w-10 h-10 rounded-lg border border-black" style={{backgroundColor: color}}></div>
              </div>
              <div className="font-sans">
                <CompactPicker color={color} onChangeComplete={(color) => setColor(color.hex)}/>
              </div>
            </div>
            <div className="flex flex-col flex-1 gap-4 py-2">
              <input className="primary-button font-playfair p-4 text-xl text-black" placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              <div className="flex gap-2">
                <div className="flex-1 bg-white font-sans">
                  <SettingSlider label={"Tile Size"} value={size} onUpdate={setSize} step={1} min={4} max={50} />
                </div>
                <button className="primary-button p-4 text-xl font-playfair flex-1 hover:bg-black hover:text-white hover:scale-105 duration-300 disabled:bg-opacity-50 disabled:bg-black disabled:text-white" onClick={() => {setFilename(projectName); updateJson(); changeState("DRAWING"); setImported(false); setStarted(true);}} disabled={projectName===""}>Start Project</button>
              </div>
            </div>
          </div>
        </div>}
      </div>
    </div>
    </>
  )
}

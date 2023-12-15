import { WelcomePage } from "./Components/Pages/WelcomePage.jsx";
import { ConnectionPage } from "./Components/Pages/ConnectionPage.jsx";
import { GenerationPage } from "./Components/Pages/GenerationPage.jsx";
import { StartingPage } from "./Components/Pages/StartingPage.jsx";
import { useState } from "react";
import { DrawingPage } from "./Components/Pages/DrawingPage.jsx";
import './Styles/Backgrounds.css'

function App() {
  const [json, setJson] = useState({
    settings: {
      tileSize: 5,
      defaultColor: "#ffffff",
      connections: [],
    },
    tileSet: {}
  });
  const [state, setState] = useState("WELCOME");
  const [filename, setFilename] = useState("");
  const [imported, setImported] = useState(false)
  const [started, setStarted] = useState(false)

  return (
    <div className={`${state} flex font-playfair text-white justify-center items-center h-screen w-screen`}>
      {state === "WELCOME" && <WelcomePage changeState={setState} setJson={setJson} />}
      {state === "STARTING" && (
        <StartingPage
          changeState={setState}
          json={json}
          setJson={setJson}
          filename={filename}
          setFilename={setFilename}
          imported={imported}
          setImported={setImported}
          started={started}
          setStarted={setStarted}
        />
      )}
      {state === "DRAWING" && (
        <DrawingPage
          changeState={setState}
          json={json}
          setJson={setJson}
          filename={filename}
        />
      )}
      {state === "CONNECTING" && (
        <ConnectionPage
          json={json}
          changeState={setState}
          setJson={setJson}
          filename={filename}
        />
      )}
      {state === "GENERATING" && (
        <GenerationPage
          tilesJson={json}
          changeState={setState}
          setJson={setJson}
          filename={filename}
        />
      )}
    </div>
  );
}

export default App;

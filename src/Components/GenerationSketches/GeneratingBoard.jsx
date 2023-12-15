import { ReactP5Wrapper } from "react-p5-wrapper";
import { sketch } from "./sketch";

export const GeneratingBoard = ({boardDimension, json, animationSpeed, callbackWord, fixedTile}) => {
  return (
    <ReactP5Wrapper
      sketch={sketch}
      height={window.innerHeight / 1.25}
      width={window.innerHeight / 1.25}
      json={json}
      gridSize={boardDimension}
      callback={callbackWord}
      animationSpeed={animationSpeed}
      fixedTile={fixedTile}
    />
  );
};

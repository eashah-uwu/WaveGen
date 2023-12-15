import { ReactP5Wrapper } from "react-p5-wrapper";
import { sketch } from "./sketch";

export const DrawingBoard = ({size, defaultColor, selectedColor, callBackWord, addTile, img, setSelectedColor}) => {

  return (
    <ReactP5Wrapper
      sketch={sketch}
      height={window.innerHeight / 1.25}
      width={window.innerHeight / 1.25}
      defaultColor={defaultColor}
      selectedColor={selectedColor}
      size={size}
      callBackWord={callBackWord}
      addTile={addTile}
      image={img}
      setSelectedColor={setSelectedColor}
    />
  )
}

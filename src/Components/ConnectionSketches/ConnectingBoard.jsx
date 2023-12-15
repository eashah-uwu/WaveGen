import { ReactP5Wrapper } from "react-p5-wrapper";

export const ConnectingBoard = ({sketch, width, height, Tiles, connections, addConnection, hoverConnection, bgColor}) => {
  return (
    <div className="p-2 w-3/4 rounded-3xl" style={{backgroundColor: bgColor}} onContextMenu={e => {e.preventDefault()}}>
      <ReactP5Wrapper
        sketch={sketch}
        w={width}
        h={height}
        Tiles={Tiles}
        connections={connections}
        update={addConnection}
        hoverConnection={hoverConnection}
        bgColor={bgColor}
      />
    </div>
  );
};

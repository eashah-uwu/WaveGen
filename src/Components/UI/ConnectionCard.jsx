import {memo, useEffect, useState } from "react";
import { rotateImage } from "../AdjacencySketches/Tiles";
import { TileImg } from "./TileImg";

export const mod = (n, d) => {
  while (n < 0) n += d
  return n % d
}

const ConnectionCard = ({ connection, deleteConnection, setHover, filter }) => {


  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (hovering) setHover()
    else setHover(null)
  }, [hovering])

  const img0 = connection[0].parent.img
  const orientation0 = connection[0].direction
  const img1 = connection[1].parent.img
  const orientation1 = connection[1].direction

  return (
    <div className="relative group flex justify-center p-4 gap-2 bg-neutral-800 rounded-xl border border-black" onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className="w-12 h-12" onClick={() => filter(connection[0].parent.name)}>
        <TileImg img={rotateImage(img0, mod(1-orientation0, 4))} />
      </div>
      <div className="flex-1 flex items-center group-hover:hidden">
          <span className="p-[2px] bg-white border border-black w-full"></span>
      </div>
      <div className="w-12 h-12" onClick={() => filter(connection[1].parent.name)}>
        <TileImg img={rotateImage(img1, mod(3-orientation1, 4))} />
      </div>
      {hovering && 
      <button className="absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 h-7 w-7 p-1 text-white bg-red-500 rounded-full border-black border-2 bg-opacity-50 hover:bg-opacity-100" onClick={e => {deleteConnection();}}>
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><title>Delete</title><path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" fill="currentColor"/></svg>
      </button>}
    </div>
  );
};
export default memo(ConnectionCard);
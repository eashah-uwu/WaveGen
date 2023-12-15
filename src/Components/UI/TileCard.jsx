import { useEffect, useState } from "react";
import { TileImg } from "./TileImg";

export const TileCard = ({ tileObject, onUpdate, value: v = 1 , setToPlace, highlight}) => {
  const [value, setValue] = useState(v);

  useEffect(() => {
    onUpdate(value);
  }, [value]);

  return (
    <div className={`border-black border ${highlight ? "bg-neutral-100 text-black" : "bg-neutral-800 text-white" } rounded-lg aspect-square flex flex-col justify-center items-center p-2 gap-1`}>
      <div className=" w-11/12 aspect-square" onClick={() => setToPlace(highlight ? null : tileObject.name)}>
        <TileImg img={tileObject.tile.img} />
      </div>
      {/* <p className="text-white">{tileObject.name}</p> */}
      <div className="flex gap-1">
        <input
          className="w-full"
          type="range"
          min={0}
          max={10}
          defaultValue={value}
          step={0.1}
          onChange={(e) => setValue(+e.target.value)}
        />
        <p>{value.toFixed(1)}</p>
      </div>
    </div>
  );
};

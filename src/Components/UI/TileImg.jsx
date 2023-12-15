import { ColouredDiv } from "./ColouredDiv"

export const TileImg = ({img}) => {
  return (
    <div className="flex flex-col bg-white p-[2px] w-full h-full">
      {img.map(row => {
        return (
        <div className="flex flex-1 w-full">
          {row.map(pixel => <ColouredDiv color={pixel} />)}
        </div>
        )
      })}
    </div>
  )
}

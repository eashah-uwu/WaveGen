export const ColouredDiv = ({color}) => {
  return (
    <div className="h-full w-full flex-1" style={{backgroundColor: `rgb(${color[0]}, ${color[1]}, ${color[2]})`}}></div>
  )
}

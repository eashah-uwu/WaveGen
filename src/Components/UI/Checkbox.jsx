export const Checkbox = ({label, value, onUpdate}) => {
  return (
  <div className="flex justify-between items-center bg-neutral-800 p-4 rounded-xl border border-black">
    <p className="text-xl text-white">{label}</p>
    <button className={`h-5 w-5 border-2 border-white ${value ? "bg-blue-500" : "bg-neutral-500"} rounded-sm`} onClick={() => onUpdate(!value)}></button>
  </div>);
};

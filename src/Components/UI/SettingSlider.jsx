export const SettingSlider = ({ label, value, onUpdate, min=1, max=100, step=1 }) => {
  return (
    <div className="w-full rounded-xl p-4 flex flex-col gap-2 border border-black">
      <div className="text-xl flex justify-between">
        <p>{label}</p>
        <p>{value}</p>
      </div>
      <input
          className="w-full"
          type="range"
          min={min}
          max={max}
          defaultValue={value}
          step={step}
          onChange={(e) => onUpdate(+e.target.value)}
        />
    </div>
  )
};

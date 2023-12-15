export const WelcomePage = ({changeState}) => {
  return (
    <div className="flex flex-col h-full aspect-video justify-center items-center gap-10">
      <div className='flex flex-col gap-8 p-12 py-20 bg-white bg-opacity-70 text-[#562545] border-black rounded-2xl border'>
        <h1 className='text-5xl' >Welcome To WaveGen</h1>
        <p className='text-xl text-center'>Design made Easy</p>
      </div>
        
      <button className='primary-button p-4 px-8 text-xl' onClick={() => changeState("STARTING")}>Start Generating</button>
    </div>
  )
}

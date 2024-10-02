import React from 'react'
import ShowResources from './ShowResources'

function HomePage() {
  return (
    <div className="flex flex-col gap-10">
    <div className='flex flex-col items-center gap-6'>
    <h1 className="!font-semibold lg:text-[35px] sm:text-[25px] text-[20px]">Welcome to Bench Sharing Portal</h1>

    <p className='!font-bold lg:text-[18px]'>Share your ideal Resource or book!</p> 
        <p className='!font-semibold mx-auto sm:text-[18px]  lg:w-[600px] px-4'>
Connect, share, and collaborate with peers.
Got a resource you’re not using? Share it with someone who can.
Looking for a equipment, or tool? Book it here!</p>
    </div>
    <div className="relative">
    {/* <p className='!font-bold absolute top-[30%] left-[550px] text-[18px] bg-black text-white'>Share your ideal Resource or book</p> 
        <p className='!font-semibold absolute top-[40%] left-[450px]  text-white text-[20px]  w-[500px]'>Welcome to the Bench Sharing Portal!
Connect, share, and collaborate with peers.
Got a resource you’re not using? Share it with someone who can.
Looking for a equipment, or tool? Book it here!</p> */}
    <img className="h-[100vh] w-[100vw]" src="/images/home-page.jpg"/>
    </div> 
    <ShowResources/>
    </div>
  )
}

export default HomePage
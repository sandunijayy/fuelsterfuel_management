import React from 'react'
import fuelImage from '../assets/fuel.jpg';

function Home() {
  return (
    <div className="flex justify-between items-center px-40 py-44 mx-auto my-0 bg-white max-w-[1600px] max-md:flex-col max-md:gap-16 max-md:px-10 max-md:py-20 max-md:max-w-[991px] max-sm:px-5 max-sm:py-10 max-sm:max-w-screen-sm">
      {/* Left Section */}
      <section className="max-w-[650px] max-md:max-w-full max-md:text-center">
        <h1 className="mb-9 text-7xl font-bold tracking-tighter leading-[86px] text-slate-900 max-md:text-6xl max-md:tracking-tighter max-md:leading-[65px] max-sm:text-4xl max-sm:tracking-tighter max-sm:leading-10">
          Meet the New Landingfolio Kit
        </h1>
        <p className="mb-10 text-xl leading-9 text-gray-600 max-w-[530px] max-md:mx-auto max-md:text-lg max-md:leading-8 max-sm:text-base max-sm:leading-7">
          Clarity gives you the blocks & components you need to create a truly
          professional website, landing page or admin panel for your SaaS.
        </p>
        <button className="px-6 py-4 text-lg font-semibold leading-7 text-white bg-indigo-500 rounded-lg cursor-pointer border-[none] max-sm:w-full">
          Start using LandingFolio
        </button>
      </section>

      {/* Right Section (Image) */}
      <img src={fuelImage} alt="Placeholder Image" className="w-full max-w-[530px] h-auto rounded-3xl " />
    </div>
  )
}

export default Home

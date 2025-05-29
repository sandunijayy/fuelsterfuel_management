import React from 'react';

function ViewProfile() {
  return (
    <div className="min-h-screen text-[#252422] bg-[#f3f5f0] px-4 md:px-14">
      <h1 className="text-center font-semibold pt-16 md:text-2xl w-full max-w-xl mx-auto">User Profile</h1>

      <form
        action=""
        className="flex flex-col justify-center items-center w-full max-w-xl mx-auto space-y-8 mt-12"
      >
        {/* Profile Image */}
        <div className="flex justify-center w-full">
          <label htmlFor="profileImage" className="cursor-pointer">
            <img
              src="https://via.placeholder.com/150"
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-gray-300"
            />
          </label>
          <input
            type="file"
            id="profileImage"
            className="hidden"
          />
        </div>

        {/* Full Name */}
        <div className="flex flex-col w-full">
          <label htmlFor="fullName" className="md:text-lg">Full Name</label>
          <input
            type="text"
            id="fullName"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col w-full">
          <label htmlFor="email" className="md:text-lg">Email</label>
          <input
            type="email"
            id="email"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50"
          />
        </div>

        {/* City */}
        <div className="flex flex-col w-full">
          <label htmlFor="city" className="md:text-lg">City</label>
          <input
            type="text"
            id="city"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50"
          />
        </div>

        {/* Mobile No */}
        <div className="flex flex-col w-full">
          <label htmlFor="mobile" className="md:text-lg">Mobile No</label>
          <input
            type="text"
            id="mobile"
            className="w-full px-3 py-1.5 md:py-2 text-[#252422] rounded-lg bg-white border-gray-50"
          />
        </div>

        <button className="w-full bg-[#00BFFF] text-[#FFFCF2] py-2 font-medium rounded-lg" type="submit">
          Save Profile
        </button>
      </form>
    </div>
  );
}

export default ViewProfile;

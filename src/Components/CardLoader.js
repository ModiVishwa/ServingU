import React from "react";

function CardLoader() {
    
  return (

    
    <div>
    <div className="max-w-z border-2 overflow-hidden w-full h-64 shadow-lg hover:scale-110 transition duration-700 cursor-pointer rounded-md mb-6">
        <div className="w-full h-32 rounded-md  ">
          <div className="w-full bg-gray-300 h-32  justify-center"></div>
          <div className="flex animate-pulse flex-row  h-full items-center space-x-5">
            <div className="flex flex-col space-y-1">
              <div className="w-48 bg-gray-300 h-10 rounded-md ml-3 "></div>
              <div className="w-24 bg-gray-300 h-5 rounded-md ml-5 "></div>
              <div className="w-10 bg-gray-300 h-3 rounded-md ml-5 "></div>
            </div>
          </div>
        </div>
      </div>
      {/* <div classNameName="max-w-sm mx-5 border-2 overflow-hidden w-56 h-64 shadow-lg hover:scale-110 transition duration-700 cursor-pointer rounded-md">
  <img classNameName="w-full h-32 rounded-t-md" src={Img} alt="Card" />
  <div classNameName="px-6 py-4">
  <p classNameName="text-[#12372A] text-xl font-bold mb-2 text-center bg-transparent ">{Category}</p>
    <p classNameName="text-[#12372A] text-lg font-semibold  mb-2">{Sub}</p>
    <p classNameName="text-[#12372A] text-md font-bold">{Charges}*</p>
  </div>
</div> */}
    </div>
  );
}

export default CardLoader;

import React from 'react';

function AppointCard({ appoint_details }) {
  const { Sub, Category, Charges,date, status, contact , address } = appoint_details;
   
  return (
    <div className="max-w-sm mx-5 border-2 overflow-hidden w-56 h-64 shadow-lg hover:scale-110 transition duration-700 cursor-pointer rounded-md">
  {/* <img className="w-full h-32 rounded-t-md" src={Img} alt="Card" /> */}
  <div className="px-6 py-4">
  <p className="text-[#12372A] text-xl font-bold mb-2 text-center bg-transparent ">{Category}</p>
    <p className="text-[#12372A] text-lg font-semibold  mb-2">{Sub}</p>
    <p className="text-[#12372A] text-md font-bold">{Charges}*</p>
    <p className="text-[#12372A] text-lg font-semibold  mb-2">{date}</p>
    <p className="text-[#12372A] text-lg font-semibold  mb-2">{status}</p>
    <p className="text-[#12372A] text-lg font-semibold  mb-2">{contact}</p>
    <p className="text-[#12372A] text-lg font-semibold  mb-2">{address}</p>

  </div>
</div>
  );
}

export default AppointCard;

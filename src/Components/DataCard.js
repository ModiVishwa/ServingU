import React, { useState, useEffect } from "react";
import CardLoader from "./CardLoader";

function DataCard({ data_details }) {
  const { Sub, Category, Description, Charges, Img } = data_details;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-sm mx-5 border-2 overflow-hidden w-56 h-60 shadow-lg hover:scale-110 transition duration-700 cursor-pointer rounded-md mb-6">
      {loading ? (
        <CardLoader />
      ) : (
        <>
          <img className="w-full h-32 rounded-t-md" src={Img} alt="Card" />
          <div className="px-6 py-4 ">
            <p className="text-[#12372A] text-xl font-bold mb-2 text-center bg-transparent ">
              {Category}
            </p>
            <p className="text-[#12372A] text-xl   mb-1">{Sub}</p>
            <p className="text-[#12372A] text-md font-semibold pb-2">{Charges}*</p>
          </div>
        </>
      )}
    </div>
  );
}

export default DataCard;

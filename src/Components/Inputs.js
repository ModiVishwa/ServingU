// import React from 'react'

// function Inputs({ data, setData, onUpload, err, disable, dataChange }) {
//   return (
//     <div>
    
//     <div className="flex">
//       <input
//         type="text"
//         name="Sub"
//         value={data.Sub}
//         onChange={dataChange}
//         placeholder="Sub-Category"
//         className="w-52 text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
//       />

//       <div className="relative mx-3 mt-2">
//         <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
//           Select Category
//         </label>
//         <select
//           name="Category"
//           value={data.Category}
//           onChange={dataChange}
//           className="peer h-10 w-48 rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
//         >
//           <option value="">--Category--</option>
//           <option value="Home Cleaning">Home Cleaning</option>
//           <option value="Appliance Repair">Appliance Repair</option>
//           <option value="Salon">Salon</option>
//         </select>
//       </div>

//       <div className="flex mt-2">
//         <input
//           type="text"
//           name="Charges"
//           value={data.Charges}
//           onChange={dataChange}
//           placeholder="Charges"
//           className="w-1/2 text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-1 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
//         />
//         <input
//           type="file"
//           onChange={(e) => onUpload(e.target.files[0])}
//           className="mx-2 my-4 text-[#12372A] text-sm font-semibold"
//         />
//       </div>

//       <div className="flex mt-2">
//         <textarea
//           type="text"
//           name="Description"
//           value={data.Description}
//           onChange={dataChange}
//           placeholder="Description"
//           className="w-[400px] text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-1 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
//         />
//       </div>

//       <div className="flex mt-6">
//         <p className="text-red-500">{err}</p>
//       </div>

//       <div className="flex mt-8">
//         <button
//           onClick={handleOnSubmit}
//           disabled={disable}
//           className="w-1/2 bg-[#12372A] text-[#FBFADA] font-semibold rounded-md p-2 text-center flex items-center justify-center mx-auto"
//         >
//           Submit
//         </button>
//       </div>
//     </div>


//     </div>
//   )
// }

// export default Inputs
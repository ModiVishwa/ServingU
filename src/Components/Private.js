import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { auth, image_db, my_db } from "../Configure";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { RxCross2 } from "react-icons/rx";
import { v4 } from "uuid";
import { MdDelete, MdEdit } from "react-icons/md";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import toast from "react-hot-toast";

function Private() {
  const [currentPage, setCurrentPage] = useState(1); // Initialize currentPage to 1
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [editedImage, setEditedImage] = useState("");
  const [editData, setEditData] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedItem, setEditedItem] = useState(null);
  const [add, setAdd] = useState(false);
  const [selected, setSelected] = useState("");
  const [data, setData] = useState({
    Sub: "",
    Category: "",
    Description: "",
    Charges: "",
    Img: "",
    date: new Date().toISOString().slice(0,10)
  });
  const [image, setImage] = useState();
  const [err, setErr] = useState("");
  const [disable, setDisable] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [tableData, setTableData] = useState([]);
  // const [custom, setCustom] = useState("");

  const handleCategory = (category) => {
    setSelected(category === selected ? "" : category);
  };

  // Pagination Logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);
  const totalItems = tableData.length;

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(totalItems / itemsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };
  // Function to fetch all data from Firestore
  const fetchDataAll = async () => {
    try {
      const querySnapshot = await getDocs(collection(my_db, "service_data"));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      fetchedData.sort((a,b)=> new Date(b.date)-new Date(a.date))
      setTableData(fetchedData);
    } catch (error) {
      console.error("Error fetching all data:", error);
    }
  };

  // Function to fetch data by category from Firestore
  const fetchDataByCategory = async () => {
    try {
      const q = query(
        collection(my_db, "service_data"),
        where("Category", "==", selected)
      );
      const querySnapshot = await getDocs(q);
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTableData(fetchedData);
    } catch (error) {
      console.error("Error fetching data by category:", error);
    }
  };

  // Function to check admin status
  const checkAdminStatus = async (user) => {
    try {
      const docSnapshot = await getDocs(
        query(collection(my_db, "user_profiles"), where("uid", "==", user.uid))
      );
      docSnapshot.forEach((doc) => {
        const userData = doc.data();
        setIsAdmin(userData.roles === "admin");
        // console.log("is admin ", isAdmin)
      });
    } catch (error) {
      console.error("Error checking admin status:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        checkAdminStatus(user);
      } else {
        setIsAdmin(false);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchDataAll();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (selected === "") {
      fetchDataAll();
    } else {
      fetchDataByCategory();
    }
  }, [selected]);
  // const indexOfLastItem = currentPage * itemsPerPage;
  // const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  // const currentItems = tableData.slice(indexOfFirstItem, indexOfLastItem);

  // const paginate = (pageNumber) => setCurrentPage(pageNumber);
  // const handleCategory = (category) => {
  //   if (category === "") {
  //     setSelected("");
  //   } else {
  //     setSelected(category);
  //   }
  // };

  const handleData = () => {
    setAdd(!add);
    // toast.error('Services added successfully!!')
  };

  const handleOnSubmit = async () => {
    if (
      !data.Sub ||
      !data.Category ||
      !data.Description ||
      !data.Charges ||
      !data.Img
    ) {
      setErr("Please fill all fields");
      setDisable(true);
      return;
    }

    try {
      await addDoc(collection(my_db, "service_data"), { ...data });
      setData({
        Sub: "",
        Category: "",
        Description: "",
        Charges: "",
        Img: "",
      });
      setImage("");
      setErr("");
      setDisable(false);
      setAdd(false);
    toast.success('Services added successfully!!')

    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const dataChange = (e) => {
    const { name, value } = e.target;
    setData((prevInput) => ({
      ...prevInput,
      [name]: value,
    }));
  };

  const onUpload = async (file) => {
    try {
      const imgRef = ref(image_db, `img/${v4(file.name)}`);
      const snapshot = await uploadBytes(imgRef, file);
      console.log("File uploaded successfully:", snapshot);
      const url = await getDownloadURL(imgRef);
      console.log("File download URL:", url);
      setImage(url);
      setData((prev) => ({ ...prev, Img: url }));
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };
  const navigate = useNavigate("");
  const onsignout = () => {
    signOut(auth).then(() => {
      navigate("/");
    });
  };
  // const handleEdit = (rowData) => {
  //   setEditMode(true);
  //   setEditData(rowData);
  //   setEditedItem({
  //     Sub: rowData.Sub,
  //     Category: rowData.Category,
  //     Description: rowData.Description,
  //     Charges: rowData.Charges,
  //     Img: rowData.Img,
  //   });
  // };

  // const handleUpdate = async () => {
  //   try {
  //     await updateDoc(doc(my_db, 'service_data', editData.id), editedItem);
  //     setEditMode(false);
  //     setEditedItem(null);
  //   } catch (error) {
  //     console.error("Error updating data:", error);
  //   }
  // };

  const handleEdit = (rowData) => {
    setEditMode(true);
    setEditData(rowData);
    setEditedItem({
      Sub: rowData.Sub,
      Category: rowData.Category,
      Description: rowData.Description,
      Charges: rowData.Charges,
      Img: rowData.Img,
    });
    setEditedImage(rowData.Img); // Set the initial image URL
  };

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(my_db, "service_data", editData.id), {
        ...editedItem,
        Img: editedImage,
      });
      setEditMode(false);
      setEditedItem(null);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(my_db, "service_data", id));
      setTableData(tableData.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error deleting data:", error);
    }
  };

 
  //   if (!custom) {
  //   return (
  //     <div className="h-screen bg-[#ADBC9F] flex justify-center items-center">
  //       <div className="bg-white p-8 rounded-lg text-center">
  //         <h1 className="text-3xl text-red-600 mb-4">
  //           You are not authorized to access this page.
  //         </h1>
  //       </div>
  //     </div>
  //   );
  // }
  return (
    <div>
      {isAdmin && 
        <div className="w-full flex flex-col md:flex md:flex-col ">
          <Sidebar />
          <div className="flex mt-28 ml-40 md:mt-2 md:ml-40 items-center mb-0"> 
            <button
              className={`bg-green-600 text-white py-2 px-4  rounded-md  `}
              onClick={handleData}
            >
              Add Services
            </button>
            <h1 className="text-4xl font-bold items-center justify-center flex  space-x-4 mx-96 font-serif ">Services</h1>
          </div>
          <div className="ml-40 md:ml-36 space-x-4 md:pl-5">
            <button
              className={`bg-[#12372A] text-white py-2 px-4 mt-4  rounded-md ${selected === "" ? "bg-opacity-75" : ""}`}
              onClick={() => handleCategory("")}
            >
              All
            </button>
            <button
              onClick={() => handleCategory("Home Cleaning")}
              className={`px-4 py-2 rounded-md bg-[#12372A] text-white mt-4 ${selected === "Home Cleaning" ? "bg-opacity-75" : ""}`}
            >
              Home Cleaning
            </button>
            <button
              onClick={() => handleCategory("Appliance Repair")}
              className={`px-4 py-2 rounded-md bg-[#12372A] text-white mt-4 ${selected === "Appliance Repair" ? "bg-opacity-75" : ""}`}
            >
              Appliance Repair
            </button>
            <button
              onClick={() => handleCategory("Salon")}
              className={`px-4 py-2 rounded-md bg-[#12372A] text-white mt-4 ${selected === "Electrical" ? "bg-opacity-75" : ""}`}
            >
              Salon
            </button>
            <button
              className=" px-4 py-2 mt-10 bg-[#f36151] text-[#FBFADA] text-sm font-semibold rounded-md"
              onClick={onsignout}
            >
              Sign Out
            </button>
          </div>
   
  
     
        {add && !editMode && (
          <div
            className="flex fixed items-center justify-center inset-0  bg-black bg-opacity-50
                          md:flex md:items-center md:justify-center md:inset-0 md:bg-black md:bg-opacity-50"
          >
            <div className="bg-[#B6C4B6] p-8 rounded-lg">
              <div className="flex items-end justify-end">
                <button
                  className="bg-[#12372a] h-10 w-10 flex items-center justify-center text-[#B6C4B6] text-xl rounded-full"
                  onClick={handleData}
                >
                  <RxCross2 />
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  name="Sub"
                  value={data.Sub}
                  onChange={dataChange}
                  placeholder="Sub-Category"
                  className="w-52 text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />

                <div className="relative mx-3 mt-2">
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Select Category
                  </label>
                  <select
                    name="Category"
                    value={data.Category}
                    onChange={dataChange}
                    className="peer h-10 w-48 rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  >
                    <option value="">--Category--</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Salon">Salon</option>
                  </select>
                </div>
              </div>

              <div className="flex mt-2">
                <input
                  type="text"
                  name="Charges"
                  value={data.Charges}
                  onChange={dataChange}
                  placeholder="Charges"
                  className="w-1/2 text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-1 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
                <input
                  type="file"
                  onChange={(e) => onUpload(e.target.files[0])}
                  className="mx-2 my-4 text-[#12372A] text-sm font-semibold"
                />
              </div>

              <div className="flex mt-2">
                <textarea
                  type="text"
                  name="Description"
                  value={data.Description}
                  onChange={dataChange}
                  placeholder="Description"
                  className="w-[400px] text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-1 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
              </div>

              <div className="flex mt-6">
                <p className="text-red-500">{err}</p>
              </div>

              <div className="flex mt-8">
                <button
                  onClick={handleOnSubmit}
                  disabled={disable}
                  className="w-1/2 bg-[#12372A] text-[#FBFADA] font-semibold rounded-md p-2 text-center flex items-center justify-center mx-auto"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {editMode && (
          <div
            className="flex fixed items-center justify-center inset-0  bg-black bg-opacity-50
          md:flex md:items-center md:justify-center md:inset-0 md:bg-black md:bg-opacity-50"
          >
            <div className="bg-[#B6C4B6] p-8 rounded-lg">
              <div className="flex items-end justify-end">
                <button
                  className="bg-[#12372a] h-10 w-10 flex items-center justify-center text-[#B6C4B6] text-xl rounded-full"
                  onClick={() => setEditMode(false)}
                >
                  <RxCross2 />
                </button>
              </div>
              <div className="flex">
                <input
                  type="text"
                  name="Sub"
                  value={editedItem.Sub}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, Sub: e.target.value })
                  }
                  placeholder="Sub-Category"
                  className="w-52 text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-2 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />

                <div className="relative mx-3 mt-2">
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Select Category
                  </label>
                  <select
                    name="Category"
                    value={editedItem.Category}
                    onChange={(e) =>
                      setEditedItem({ ...editedItem, Category: e.target.value })
                    }
                    className="peer h-10 w-48 rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  >
                    <option value="">--Category--</option>
                    <option value="Home Cleaning">Home Cleaning</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                    <option value="Salon">Salon</option>
                  </select>
                </div>
              </div>

              <div className="flex mt-2">
                <input
                  type="text"
                  name="Charges"
                  value={editedItem.Charges}
                  onChange={(e) =>
                    setEditedItem({ ...editedItem, Charges: e.target.value })
                  }
                  placeholder="Charges"
                  className="w-1/2 text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-1 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
                {/* <input
                  type="file"
                  onChange={(e) => onUpload(e.target.files[0])}
                  className="mx-2 my-4 text-[#12372A] text-sm font-semibold"
                /> */}
                <input
                  type="file"
                  onChange={(e) => {
                    onUpload(e.target.files[0]); // Upload the new image
                    setEditedImage(URL.createObjectURL(e.target.files[0])); // Set the new image URL for preview
                  }}
                  className="mx-2 my-4 text-[#12372A] text-sm font-semibold"
                />
              </div>

              <div className="flex mt-2">
                <textarea
                  type="text"
                  name="Description"
                  value={editedItem.Description}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      Description: e.target.value,
                    })
                  }
                  placeholder="Description"
                  className="w-[400px] text-[#12372A] placeholder-[#12372A] pl-2 my-2 py-1 bg-none border-b border-[#12372A] rounded-md outline-none focus:outline-none"
                />
              </div>

              <div className="flex mt-6">
                <p className="text-red-500">{err}</p>
              </div>

              <div className="flex mt-8">
                <button
                  onClick={handleUpdate}
                  disabled={disable}
                  className="w-1/2 bg-[#12372A] text-[#FBFADA] font-semibold rounded-md p-2 text-center flex items-center justify-center mx-auto"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="overflow-x-auto mt-20 ml-40 mr-20 md:mt-10 md:ml-40 md:mr-20">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-[#12372A] text-[#FBFADA] font-semibold">
                <th className="px-4 py-2">Sub</th>
                <th className="px-4 py-2">Category</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Charges</th>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item) => (
                <tr key={item.id} className="bg-white hover:bg-gray-100">
                  <td className="border px-4 py-2">{item.Sub}</td>
                  <td className="border px-4 py-2">{item.Category}</td>
                  <td className="border px-4 py-2">{item.Description}</td>
                  <td className="border px-4 py-2">{item.Charges}</td>
                  <td className="border px-4 py-2">
                    <img
                      className="w-40 h-20 object-cover rounded-sm"
                      src={item.Img}
                      alt=""
                    />
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="hover:bg-[#ADBC9F] text-[#436850] font-bold rounded px-3 py-1"
                    >
                      <MdEdit className="w-6 h-6" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="hover:bg-[#ADBC9F] text-[#f46555] font-bold rounded px-3 py-1"
                    >
                      <MdDelete className="w-6 h-6" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-center mt-10">
          <IoIosArrowBack
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-2 py-1 ml-2 bg-[#ADBC9F] text-3xl text-gray-700 rounded-md  ${
              currentPage === 1 ? "cursor-not-allowed" : "cursor-pointer"
            }`}
          />
          <div className=" pl-2 text-center">{currentPage}</div>
          <IoIosArrowForward
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastItem >= totalItems}
            className={`px-2 py-1 ml-2 bg-[#ADBC9F] text-3xl text-gray-700 rounded-md ${
              indexOfLastItem >= totalItems
                ? "cursor-not-allowed"
                : "cursor-pointer"
            }`}
          />
        </div>

        {/* <div className="flex justify-center mt-4">
          <nav className="block">
            <ul className="flex pl-0 rounded list-none flex-wrap">
              <li>
                <button
                  onClick={() => paginate(1)}
                  className={`text-white hover:bg-[#12372A] hover:text-white py-2 px-4 ml-1 rounded-md ${
                    currentPage === 1 ? "bg-[#12372A]" : ""
                  }`}
                >
                  1
                </button>
              </li>
            </ul>
          </nav>
        </div> */}
      </div>
}
    </div>
  );
}

export default Private;

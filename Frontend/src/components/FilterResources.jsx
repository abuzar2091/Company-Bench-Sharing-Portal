import React, { useState } from "react";
import { Input } from "./ui/input";
import { useFilterContext } from "@/context/FilterContext";

function FilterResources({searchBarValue,setSearchBarValue}) {
  const dropDownOptions = [
    { label: "Filter By:", value: "filter" },
    { label: "Seating Space", value: "Seating Space" },
    { label: "Engineer", value: "Engineer" },
    { label: "Product License", value: "Product License" },
  ];
  const { filter, setFilter } = useFilterContext();

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };
  const handleSetAvailable=()=>{
    setFilter("available");
  }
  const handleSetBooked=()=>{
    setFilter("booked");
  }
  return (
    <div className="flex flex-col ">
     <div className='hidden sm:flex mt-4 sticky  top-[85px]  py-4 left-0 right-0 bg-white font-semibold justify-center sm:gap-20 xs:gap-10 gap-4'>
        <button className={`${filter==='available'?'text-blue-400':``} `} onClick={()=>{handleSetAvailable()}}>Available Resources</button>
         <button  className={`${filter==='booked'?'text-blue-400':``} `}  onClick={()=>{handleSetBooked()}}>Booked Resources</button>
       
    </div>
    <div className="flex xs:flex-row flex-col mt-4 justify-center sm:gap-6 gap-4 ">
        <div className="xs:w-[60%]  relative">
        <Input
        name="search"
        placeholder="Search Resource Type"
        value={searchBarValue}
        onChange={(e) => setSearchBarValue(e.target.value)}
        type="text"
        className="text-gray-700 w-[100%] rounded-tr-[10px] sm:pl-6 rounded-br-[10px] font-medium h-12"
       />
      <img src="/assets/icons/search.svg" className="absolute right-7  top-3"/>

        </div>
      <div className="xs:w-[30%]">
        <select
          id="resourceType"
          onChange={handleFilterChange}
          className="md:px-6 px-2 py-3  border rounded w-[100%]"
        >
          {dropDownOptions.map((option) => (
            <option key={option.value} value={option.value}>
             <p className={`${option.value===`filter`?`disabled`:``}`}> {option.label}</p>
            </option>
          ))}
        </select>
      </div>
    </div>
    </div>
  );
}
export default FilterResources;




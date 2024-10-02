import React, { useState, useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useInView } from "react-intersection-observer";
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;
function ShowResources() {
  const filter = "available";
  const { ref, inView } = useInView();
  const [selectedCounts, setSelectedCounts] = useState({});
  const [isBooking,setIsBooking]=useState();
  const navigate = useNavigate();
  // Fetch resources function with pagination
  const fetchResources = async ({ pageParam = 1 }) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/application/getresources?page=${pageParam}`);
    return {
      data: response.data.data.resource, // Array of resources
      hasMore: response.data.data.hasMore, // If there are more pages
      nextPage: pageParam + 1 // Next page to fetch
    };
  };

  // UseInfiniteQuery for handling pagination
  const {
    data, // This is the paginated data
    fetchNextPage, // Function to fetch the next page
    hasNextPage, // Boolean indicating if there are more pages to load
    isFetchingNextPage, // Boolean to indicate if next page is being fetched
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['available', filter],
    queryFn: fetchResources,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined, // Load next page if there is more data
    enabled: !!filter
  });

  // Fetch next page when `inView` becomes true
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView]);

  if (isLoading) {
    return (
      <>
        wait rakho
      </>
    );
  }

  const handleSelectChange = (resourceId, value) => {
    setSelectedCounts((prev) => ({
      ...prev,
      [resourceId]: value,
    }));
  };
  
  const handleBookResource = async (resourceId, count) => {
    // Handle booking logic here
    setIsBooking(true);
    await axios
      .post(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/users/bookresources`, { resourceId, count })
      .then((res) => {
        console.log(res?.data);
        setIsBooking(false);
        // setMessage("Resource Booked Successfully");
        // setMessageType("success");
        navigate("/my-profile");
      })
      .catch((err) => {
        setIsBooking(false);
        console.log(err);
      });
    console.log(`Booking resource with ID: ${resourceId} and count: ${count}`);
  };
  return (
    <>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4 m-4">
        {data?.pages.map((page) =>
          page.data.map((resource, index) => (
            <div key={index} className="flex flex-col gap-4 bg-blue-100 p-4 text-center">
              <h2 className='font-semibold text-[18px]'>{resource.type}</h2>
              <p>{resource.description}</p>
              <p>Available Stock Count: {resource.count}</p>
              <select
                value={selectedCounts[resource._id] || ""}
                onChange={(e) => handleSelectChange(resource._id, e.target.value)}
                className="border rounded p-2 text-black"
              > 
                <option value="" >
                  Select count
                </option>
                {[...Array(resource.count).keys()].map((i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
              <button
                className={`${selectedCounts[resource._id]?`bg-black`:`bg-black opacity-50`} p-2 font-bold cursor-pointer text-white rounded-sm`}
                onClick={() => handleBookResource(resource._id, selectedCounts[resource._id])}
                disabled={!selectedCounts[resource._id]}
              
              >
                {selectedCounts[resource._id] && isBooking ? (
                  <div className="flex justify-center gap-2">
                    <Loader /> Booking...
                  </div>
                ) : (
                  <div>Book for ME</div>
                )}
              </button>
            </div>
          ))
        )}
      </div>

      {/* Show loader and fetch more content when inView */}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center">
          {isFetchingNextPage ? <Loader /> : null}
        </div>
      )}
    </>
  );
}

export default ShowResources;

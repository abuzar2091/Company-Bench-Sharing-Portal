import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from './Loader.jsx';
import { useMessageContext } from '@/context/MessageContext';
import { useQuery } from '@tanstack/react-query';
axios.defaults.withCredentials = true;

function MyProfile() {
    const [selectedCounts, setSelectedCounts] = useState({});
    const [isReleasing,setIsReleasing]=useState(false);
    const { message, messageType,setMessage,setMessageType } = useMessageContext();
   
    const fetchBookedResources = async () => {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/users/getbookedresources`);
        return response.data.data.bookedResources;
      };
      const {
        data: bookedResources,
        isLoading,
        error,
      } = useQuery({
        queryKey: ['bookedResources'], // Unique key for this query
        queryFn: fetchBookedResources, // Function that fetches the data
        staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes (optional)
        cacheTime: 10 * 60 * 1000, // Data remains in cache for 10 minutes after component unmounts (optional)
        refetchOnWindowFocus: false, // Do not refetch when window gains focus (optional)
      });

    const handleReleaseResource = async (resourceId, count) => {
        setIsReleasing(true);
        await axios.post(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/users/releaseresources`, { resourceId, count })
            .then((res) => {
                console.log(res?.data);
                
                setMessage("Resource Released Successfully");
                setMessageType("success");
                const updatedResources = bookedResources?.map((resource) => {
                    if (resourceId === resource?.resourceDetails._id) {
                        const updatedCount = resource?.bookedResources?.countToBook - count;
                        if (updatedCount > 0) {
                            return {
                                ...resource,
                                bookedResources: {
                                    ...resource.bookedResources,
                                    countToBook: updatedCount
                                }
                            };
                        }
                    }
                    return resource;
                }).filter(resource => resource?.bookedResources?.countToBook > 0);
    
                setBookedResources(updatedResources);
                setIsReleasing(false);
            })
            .catch((err) => {
                setIsReleasing(false);
                console.log(err);
            });
    };
    
    const handleSelectChange = (resourceId, value) => {
        setSelectedCounts((prev) => ({
            ...prev,
            [resourceId]: value,
        }));
    };


    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'long' });
        const year = date.getFullYear();

        const daySuffix = (day) => {
            if (day > 3 && day < 21) return 'th';
            switch (day % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        return `${day}${daySuffix(day)} ${month} ${year}`;
    };
    useEffect(() => {
        if (message) {
          const timer = setTimeout(() => {
            setMessage('');
          }, 5000); // 5 seconds
    
          return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
        }
      }, [message, setMessage]);

    if(isLoading){
        return <div className='flex w-full min-h-screen justify-center '>
            <div className='flex gap-3'><Loader/> <p>Loading...</p></div>
        </div>
    }
    return (
        <div className='min-h-screen flex flex-col'>
            <h1 className='flex justify-center md:text-2xl text-lg font-semibold'>Your Booked Resource</h1>
            {!bookedResources && <p className='flex justify-center sm:text-lg text-md font-semibold mt-3'>you have no booked resource</p>}
             {message && (
              <div className={`message ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-2 mb-1 text-white`}>{message}</div>
             )}
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 m-6">
                {bookedResources?.length>0 && bookedResources?.map((booking, index) => (
                    <div key={index} className='flex flex-col gap-4 bg-blue-100 p-4 text-center'>
                        <h2 className="font-semibold text-[18px]">{booking.resourceDetails.type}</h2>
                        <p>{booking.resourceDetails.description}</p>
                        <p>Booked Count: {booking.bookedResources.countToBook}</p>
                        <p>Booked At: {formatDate(booking.bookedResources.bookedAt)}</p>
                        <select
                            value={selectedCounts[booking.resourceDetails._id] || ''}
                            onChange={(e) => handleSelectChange(booking.resourceDetails._id, e.target.value)}
                            className="border rounded p-2 text-black"
                        >
                            <option value="">Select count</option>
                            {[...Array(booking.bookedResources.countToBook).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleReleaseResource(booking.resourceDetails._id, selectedCounts[booking.resourceDetails._id])}
                          disabled={!selectedCounts[booking.resourceDetails._id]}
                          //className="flex gap-2"
                           className={`${selectedCounts[booking.resourceDetails._id]?`bg-black`:`bg-black opacity-50`} p-2 font-bold cursor-pointer text-white rounded-sm`}
                        > {
                            selectedCounts[booking.resourceDetails._id] && isReleasing ?(<div className='flex gap-2 justify-center'><Loader/> Releasing...</div>):(<div>Release</div>)
                        }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyProfile;

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import Loader from './Loader.jsx';

function MyProfile() {
    const [isLoading,setIsLoading]=useState(true);
    const [bookedResources, setBookedResources] = useState(null);
    const [selectedCounts, setSelectedCounts] = useState({});
    const [isReleasing,setIsReleasing]=useState(false);
    useEffect(() => {
        const getBookedResource = async () => {
            await axios.get(`${import.meta.env.VITE_API_URI}/api/v1/users/getbookedresources`)
                .then((res) => {
                    setIsLoading(false);
                        setBookedResources(res.data.data.bookedResources);
                
                    console.log("response ",res);
                })
                .catch((err) => {
                    console.log("errors here ",err);
                });
        }
        getBookedResource();
    }, []);
    const handleReleaseResource = async (resourceId, count) => {
        setIsReleasing(true);
        await axios.post(`${import.meta.env.VITE_API_URI}/api/v1/users/releaseresources`, { resourceId, count })
            .then((res) => {
                console.log(res.data);
    
                const updatedResources = bookedResources?.map((resource) => {
                    if (resourceId === resource.resourceDetails._id) {
                        const updatedCount = resource.bookedResources.countToBook - count;
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
                }).filter(resource => resource.bookedResources.countToBook > 0);
    
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

    if(isLoading){
        return <div className='flex w-full min-h-screen justify-center bg-blue-100'>
            <div className='flex gap-3'><Loader/> <p>Loading...</p></div>
        </div>
    }

    return (
        <div className='min-h-screen flex flex-col'>
            <h1 className='flex justify-center md:text-2xl text-lg font-semibold'>Your Booked Resource</h1>
            {!bookedResources && <p className='flex justify-center sm:text-lg text-md font-semibold mt-3'>you have no booked resource</p>}
          
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 m-6">
                {bookedResources?.length>0 && bookedResources?.map((booking, index) => (
                    <div key={index} className='flex flex-col justify-between gap-2 text-white text-center sm:p-8 p-3 bg-blue-400 rounded-lg'>
                        <p>Type: {booking.resourceDetails.type}</p>
                        <p>Description: {booking.resourceDetails.description}</p>
                        <p>Booked Count: {booking.bookedResources.countToBook}</p>
                        <p>Booked At: {formatDate(booking.bookedResources.bookedAt)}</p>
                        <select
                            value={selectedCounts[booking.resourceDetails._id] || ''}
                            onChange={(e) => handleSelectChange(booking.resourceDetails._id, e.target.value)}
                            className="border rounded p-2 text-black"
                        >
                            <option value="" disabled>Select count</option>
                            {[...Array(booking.bookedResources.countToBook).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <Button
                            onClick={() => handleReleaseResource(booking.resourceDetails._id, selectedCounts[booking.resourceDetails._id])}
                          disabled={!selectedCounts[booking.resourceDetails._id]}
                          //className="flex gap-2"
                        > {
                            selectedCounts[booking.resourceDetails._id] && isReleasing ?(<div className='flex gap-2'><Loader/> Releasing...</div>):(<div>Release</div>)

                        }
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyProfile;

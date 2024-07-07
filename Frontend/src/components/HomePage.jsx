import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import Loader from './Loader';
import { useMessageContext } from '@/context/MessageContext';
import ToBecomeAdminForm from './ToBecomeAdminForm';
axios.defaults.withCredentials = true;
function HomePage() {
    const [showResources, setShowResources] = useState(null);
    const [isLoading,setIsLoading]=useState(true);
    const [selectedCounts, setSelectedCounts] = useState({});
    const navigate=useNavigate();
    const { message, messageType,setMessage,setMessageType } = useMessageContext();

    useEffect(() => {
        const getResources = async () => {
            await axios.get(`/api/v1/users/getresources`)
                .then((res) => {
                    console.log(res.data.data.resources);
                    setShowResources(res.data.data.resources);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.log(err);
                });
        };
        getResources();
    }, []);
    const [isBooking,setIsBooking]=useState(false);
    useEffect(() => {
        if (message) {
          const timer = setTimeout(() => {
            setMessage('');
          }, 7000); // 10 seconds
    
          return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
        }
      }, [message, setMessage]);

    const handleBookResource = async(resourceId, count) => {
        // Handle booking logic here
        setIsBooking(true);
        await axios.post(`/api/v1/users/bookresources`,{resourceId,count})
        .then((res)=>{
            console.log(res.data);
            setIsBooking(false);
            setMessage("Resource Booked Successfully");
            setMessageType("success");
            navigate("/my-profile");
        })
        .catch((err)=>{
            setIsBooking(false);
            console.log(err);
        })
        console.log(`Booking resource with ID: ${resourceId} and count: ${count}`);
    };

    const handleSelectChange = (resourceId, value) => {
        setSelectedCounts((prev) => ({
            ...prev,
            [resourceId]: value,
        }));        
    };
    if(isLoading){
        return <div className='min-h-screen bg-blue-100 flex gap-4 pt-5 justify-center'><Loader/>Loading...</div>
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-100">
            <p className='text-bold text-white bg-blue-400 text-center py-5 font-semibold sm:text-xl text-md'>
                Bench Sharing Portal
            </p>
            {message && (
              <div className={`message ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-2 mb-1 text-white text-center`}>{message}</div>
             )}
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 m-6">
                {showResources?.map((resource) => (
                    <div key={resource?._id} className='flex flex-col justify-between gap-2 text-white text-center sm:p-8 p-3 bg-blue-400 rounded-lg'>
                        <p>Type: {resource.type}</p>
                        <p>Description: {resource.description}</p>
                        <p>Available Stock Count: {resource.count}</p>
                        <select
                            value={selectedCounts[resource._id] || ''}
                            onChange={(e) => handleSelectChange(resource._id, e.target.value)}
                            className="border rounded p-2 text-black"
                        >
                            <option value="" disabled>Select count</option>
                            {[...Array(resource.count).keys()].map(i => (
                                <option key={i + 1} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <Button
                            onClick={() => handleBookResource(resource._id, selectedCounts[resource._id])}
                          disabled={!selectedCounts[resource._id]}
                          //className="flex gap-2"
                        > {
                            selectedCounts[resource._id] && isBooking ?(<div className='flex gap-2'><Loader/>  Booking...</div>):(<div>Book for ME</div>)
                        }
                        </Button>
                    </div>
                ))}
            </div>
            <ToBecomeAdminForm/>
        </div>
    );
}

export default HomePage;

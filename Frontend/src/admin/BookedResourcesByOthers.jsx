import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
axios.defaults.withCredentials = true;
function BookedResourcesByOthers() {
    const navigate=useNavigate();
    const [bookedResources, setBookedResources] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const handleBookedByUser=(bookedByUser)=>{
       navigate('/admin/booked-resources-by-user',{state: { bookedByUser }});
    }
    useEffect(()=>{
        const getBookedResource=async()=>{
          await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/admin/getbookedResourceByOthers`,{
            withCredentials:true
          })
            .then((res)=>{
                console.log(res.data.data.bookedResources);
                setBookedResources(res.data.data.bookedResources);
            })
            .catch((err)=>{
                console.log(err);
            })
            setIsLoading(false)
        }
        getBookedResource();
    },[]);
    if(isLoading){
        return (  
            isLoading && (<div className='flex justify-center'>Loading...</div>)
        );
    }
  return (
   

   
    <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-10 xl:mx-10 mx-6 mt-10'>
     
          {
            bookedResources && bookedResources?.map((resource)=>(
                <div key={resource._id} className='flex flex-col gap-3 font-semibold justify-around xl:px-4 px-6 py-4 rounded-lg bg-blue-300 text-white'>
                 <p>Type: {resource.resourceDetails.type}</p>
                 <p>Description: {resource.resourceDetails.description}</p>
                 <Button onClick={()=>handleBookedByUser(resource.bookedResources)}>Booked By {resource.bookedResources.length} {resource.bookedResources.length===1?"User":"Users"}</Button>
                </div>
            ))
        }
        
    </div>

  )
};
export default BookedResourcesByOthers
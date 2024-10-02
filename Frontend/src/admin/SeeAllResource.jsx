import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMessageContext } from '@/context/MessageContext';
import Loader from '@/components/Loader';
axios.defaults.withCredentials = true;

function SeeAllResource() {
    const [loading,setLoading]=useState(true);
    const [addedResource,setAddedReSource]=useState();
    const { message, messageType,setMessage,setMessageType } = useMessageContext();
    const navigate = useNavigate();
    useEffect(()=>{
        const getAddedResource=async()=>{
          await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/admin/getaddedresource`,{
            withCredentials:true
          })
          .then((res)=>{
            setAddedReSource(res?.data?.data?.resource);
            console.log(res?.data?.data?.resource);
            setLoading(false);
          })
          .catch((err)=>{
            console.log(err);
          })
        }
        getAddedResource();
    },[])
    useEffect(() => {
        if (message) {
          const timer = setTimeout(() => {
            setMessage('');
          }, 5000); // 5 seconds
    
          return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
        }
      }, [message, setMessage]);
    const updateResource = (resource) => {
        console.log("res ",resource);
        navigate('/admin/update-resource', { state:  {resource}  });
      };
      const deleteResource = async(resourceId) => {
       await axios.post(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/admin/deleteresource/${resourceId}`,{
        withCredentials:true
       })
       .then((res)=>{
        console.log(res.data);
        setMessage("Resource Deleted Successfully");
        setMessageType("success");
        const data=addedResource?addedResource.filter((resource)=>resource._id!==resourceId):null;
        setAddedReSource(data);
       })
       .catch((err)=>{
        console.log(err);
        setMessage("Some Error Occur");
        setMessageType("error");
      });
    }
    useEffect(() => {
        if (message) {
          const timer = setTimeout(() => {
            setMessage('');
          }, 5000); // 5 seconds
    
          return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
        }
      }, [message, setMessage]);
    
 if(loading){ 
 return (<div className='min-h-screen flex flex-col items-center'>
    <h1>See All Resource</h1>
    <p className='flex'><Loader/> Loading Resources....</p>
</div>);
 }

  return (
    <div className='flex flex-col w-full min-h-screen'>
        <h1 className='text-center font-semibold text-3xl'>See All Resource</h1>
        {message && (
              <div className={`message ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-2 mb-1 text-white text-center`}>{message}</div>
        )}
        {addedResource.length===0 && 
                <div className='text-center font-semibold mt-4'>No added resource found</div>
        }
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-4 xs:m-8 m-6'>
        {
          addedResource?.map((resource)=>(
                <div key={resource?._id} className='flex flex-col gap-2  text-center sm:p-8  p-3 bg-blue-100 rounded-lg justify-between'>
                  <p className="font-semibold text-[18px]">{resource.type}</p>
                  <p>{resource.description}</p>
                  <p>Count: {resource.count}</p>
                  <p>Status: {resource.status}</p>
                  <div className='flex justify-between'>
                  <button   onClick={()=>updateResource({resource})} className='bg-green-600 rounded-lg py-2 font-bold px-4'>Update</button>
                  <Button className="font-bold" onClick={()=>deleteResource(resource?._id)}>Delete</Button>
                  </div>
                </div>
            ))
        }
        </div>
      
    </div>
  )
}

export default SeeAllResource
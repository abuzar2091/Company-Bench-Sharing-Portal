import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

function SeeAllResource() {
    const [loading,setLoading]=useState(true);
    const [deleted,setDeleted]=useState(false);
    const [addedResource,setAddedReSource]=useState();
    const navigate = useNavigate();
    useEffect(()=>{
        const getAddedResource=async()=>{
          await axios.get("/api/v1/admin/getaddedresource")
          .then((res)=>{
            setAddedReSource(res.data.data.resource);
            console.log(res.data.data.resource);
            setLoading(false);
          })
          .catch((err)=>{
            console.log(err);
          })
        }
        getAddedResource();
    },[])
    const updateResource = (resource) => {
        console.log("res ",resource);
        navigate('/admin/update-resource', { state:  {resource}  });
      };
      const deleteResource = async(resourceId) => {
       await axios.post(`/api/v1/admin/deleteresource/${resourceId}`)
       .then((res)=>{
        console.log(res.data);
        const data=addedResource?addedResource.filter((resource)=>resource._id!==resourceId):null;
        setAddedReSource(data);
        setDeleted(true);
       })
       .catch((err)=>{
        console.log(err);
      });
    }
    useEffect(()=>{
        if(deleted){
            setTimeout(()=>{
                setDeleted(false);
            },5000);
        }
    },[deleted]);
    
 if(loading){ 
 return (<div className='min-h-screen flex flex-col items-center'>
    <h1>See All Resource</h1>
    <p className=''>Loading Resources....</p>
</div>);
 }

  return (
    <div className='flex flex-col w-full min-h-screen'>
        <h1 className='text-center font-semibold text-3xl'>See All Resource</h1>
        {deleted && <p className='bg-green-500 text-white text-center font-semibold'>Resource deleted successfully</p>}
        {addedResource.length===0 && 
                <div className='text-center font-semibold mt-4'>No added resource found</div>
        }
        <div className='grid lg:grid-cols-3 sm:grid-cols-2 gap-4 xs:m-8 m-6'>
        {
          addedResource?.map((resource)=>(
                <div key={resource?._id} className='flex flex-col gap-2 text-white text-center sm:p-8  p-3 bg-blue-400 rounded-lg justify-between'>
                  <p>Type: {resource.type}</p>
                  <p>Description: {resource.description}</p>
                  <p>Count: {resource.count}</p>
                  <p>Status: {resource.status}</p>
                  <div className='flex justify-between'>
                  <button onClick={()=>updateResource({resource})} className='bg-green-600 rounded-lg py-2 px-4'>Update</button>
                  <Button onClick={()=>deleteResource(resource?._id)}>Delete</Button>
                  </div>
                </div>
            ))
        }
        </div>
      
    </div>
  )
}

export default SeeAllResource
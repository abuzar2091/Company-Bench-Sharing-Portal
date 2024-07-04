import React, { useEffect, useState } from 'react'
import axios from "axios"
import { Button } from '@/components/ui/button';

function SeeAllResource() {
    const [loading,setLoading]=useState(true);
    const [addedResource,setAddedReSource]=useState();
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

 loading && 
 <div className='min-h-screen flex flex-col items-center'>
    <h1>See All Resource</h1>
    <p className=''>Loading Resources....</p>
</div>

  return (
    <div className='flex flex-col w-full min-h-screen'>
        <h1 className='text-center font-semibold text-3xl'>See All Resource</h1>
        <div className='grid grid-cols-3 gap-4 m-8'>
        {
            addedResource?.map((resource)=>(
                <div className='flex flex-col gap-2 text-white text-center p-8  bg-blue-400 rounded-lg'>
                  <p>Type: {resource.type}</p>
                  <p>Description: {resource.description}</p>
                  <p>Count: {resource.count}</p>
                  <p>Status: {resource.status}</p>
                  <div className='flex justify-between '>
                  <button className='bg-green-600 rounded-lg py-2 px-4'>Update</button>
                  <Button>Delete</Button>
                  </div>
                </div>
            ))
        }
        </div>
    </div>
  )
}

export default SeeAllResource
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '@/components/ui/button';

function AdminPanel() {
  const [unverifiedUser, setUnverifiedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUnverifiedRequest = async () => {
      await axios.get(`${import.meta.env.VITE_API_URI}/api/v1/admin/getunverifieduser`)
        .then((res) => {
          console.log(res.data);
          setUnverifiedUser(res.data);
        })
        .catch((err) => {
          console.log('error ', err);
        });
    };
    getUnverifiedRequest();
  }, []);

  const handleVerifyUser = () => {
    navigate('/admin/verifyemployee', { state: { unverifiedUser } });
  };
  const addResource = () => {
    navigate('/admin/add-resource');
  };
  const seeAllResource=()=>{
    navigate("/admin/allresources");
  }
 

  return (
    <div className="flex   flex-col min-h-screen ">
      <h1 className="text-center font-semibold text-3xl">Admin Panel</h1>
       <div className='flex justify-between  xs:flex-row flex-col'>

      <div className='flex flex-col bg-blue-300 sm:w-[40%] h-[200px] sm:ml-4  w-[50%] ml-4 rounded-lg justify-around'>
      <h2 className='text-white font-semibold text-center'>Unverified Users Request {unverifiedUser?.data?.length}</h2>
      <Button onClick={handleVerifyUser}>Verify User</Button>
      </div>

      <div className='flex sm:flex-row  gap-4 m-4 flex-col'>
        <Button onClick={seeAllResource}>See All Resources</Button>
        <Button onClick={addResource}>Add Resource</Button>
      </div>
      </div> 
      <h2 className='text-center font-semibold text-3xl'>Booked Resources</h2>

    </div>
  );
}

export default AdminPanel;

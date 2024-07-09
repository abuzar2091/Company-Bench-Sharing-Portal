import axios from 'axios';
import React, { useEffect, useState } from 'react'
axios.defaults.withCredentials=true;

function CompanyID() {
    const [companyData,setCompanyData]=useState(null);
    useEffect(()=>{
        const getCompanyDetails=async()=>{
             await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/application/getCompanyDetails`)
             .then((res)=>{
                setCompanyData(res?.data?.data?.company);
                console.log(res?.data?.data?.company);
             })
             .catch((err)=>{
                console.log(err);
             })
        }
        getCompanyDetails();
    },[]);
  return (
    <div className='min-h-screen bg-gray-100'>
        <div className='flex justify-start w-[80%] text-base  mx-auto mt-8'>
            <p>If You are the Employee of anyone below mentioned Company,
            you can use the Company Id associated with their names
            to register on this portal. your request will go the admin. he/she will verify.
            </p>            
        </div>
       <div className='overflow-x-auto lg:mx-20 mt-8 pb-8'>
        <div className='min-w-full inline-block align-middle'>
          <div className='overflow-hidden shadow-md'>
            <table className='min-w-full bg-white'>
              <thead>
                <tr>
                  <th className='py-2 md:px-4 px-2 border-b'>Company Name</th>
                  <th className='py-2 md:px-4 px-2 border-b'>Company ID</th>
                </tr>
              </thead>
              <tbody>
                {
                  companyData ? companyData.map((company, index) => (
                    <tr key={index} className='text-center'>
                      <td className='py-2 md:px-4 px-2 border-b'>{company.companyName}</td>
                      <td className='py-2 md:px-4 px-2 border-b'>{company._id}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="2" className='py-2 px-4 border-b text-center'>No Registered Company Found</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default CompanyID
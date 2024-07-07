import React from 'react';
import { useLocation } from 'react-router-dom';

function BookedByUser() {
  const location = useLocation();
  const bookedByUser = location.state?.bookedByUser;
  console.log(bookedByUser);

  return (
    <div className='flex flex-col p-4 min-h-screen'>
      <h1 className='md:text-xl font-bold mb-4 text-center'>Booked By User</h1>
      <div className='overflow-x-auto lg:mx-20'>
        <div className='min-w-full inline-block align-middle'>
          <div className='overflow-hidden shadow-md'>
            <table className='min-w-full bg-white'>
              <thead>
                <tr>
                  <th className='py-2 md:px-4 px-2 border-b'>Booked By</th>
                  <th className='py-2 md:px-4 px-2 border-b'>Company Employee</th>
                  <th className='py-2 md:px-4 px-2 border-b'>Count</th>
                  <th className='py-2 md:px-4 px-2 border-b'>Booked On</th>
                </tr>
              </thead>
              <tbody>
                {
                  bookedByUser ? bookedByUser.map((user, index) => (
                    <tr key={index} className='text-center'>
                      <td className='py-2 md:px-4 px-2 border-b'>{user.bookedBy.username}</td>
                      <td className='py-2 md:px-4 px-2 border-b'>{user.bookedBy.companyId}</td>
                      <td className='py-2 md:px-4 px-2 border-b'>{user.countToBook}</td>
                      <td className='py-2 md:px-4 px-2 border-b'>{new Date(user.bookFrom).toLocaleDateString()}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className='py-2 px-4 border-b text-center'>No data available</td>
                    </tr>
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookedByUser;


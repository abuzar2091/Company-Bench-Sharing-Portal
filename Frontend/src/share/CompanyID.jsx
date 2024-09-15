import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom'; // To detect route changes
axios.defaults.withCredentials = true;

function CompanyID() {
  const [companyData, setCompanyData] = useState([]); // Stores all the company data
  const [page, setPage] = useState(1); // Pagination page
  const [loading, setLoading] = useState(false); // To track the loading state
  const [hasMore, setHasMore] = useState(true); // To track if there's more data to load

  const location = useLocation(); // Used to detect route changes

  useEffect(() => {
    // Fetch data only if it's not cached
    fetchCompanyDetails();
  }, [location]); // Fetch the data only on the initial render or if the route changes

  // Function to fetch company details in batches of 10
  const fetchCompanyDetails = async () => {
    if (loading || !hasMore) return; // Prevent multiple requests
    setLoading(true);

    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/application/getCompanyDetails?page=${page}&limit=10`);
      const newData = res?.data?.data?.companies || [];

      // Prevent duplicate data by checking if the new data already exists in the state
      const filteredData = newData.filter(
        (company) => !companyData.some((existingCompany) => existingCompany._id === company._id)
      );

      // Append filtered data (no duplicates)
      setCompanyData((prev) => [...prev, ...filteredData]);

      setPage(page + 1); // Increment the page

      // If fewer than 10 records are returned, we've reached the end
      if (newData.length < 10) {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Infinite scroll function
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight && !loading) {
      fetchCompanyDetails();
    }
  };

  // Set up an event listener for scroll events
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading]);

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
                  companyData.length > 0 ? companyData.map((company, index) => (
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
      {loading && <p>Loading more companies...</p>}
    </div>
  );
}

export default CompanyID;

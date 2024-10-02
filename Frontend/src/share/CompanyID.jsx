import axios from 'axios';
import React, { useEffect } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
axios.defaults.withCredentials = true;

function CompanyID() {
  const companyID = 'company';
  const { ref, inView } = useInView(); // useInView hook for detecting if the element is in the viewport

  // Fetch function for getting the company details with pagination
  const fetchCompanyDetails = async ({ pageParam = 1 }) => {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/application/getCompanyDetails?page=${pageParam}`);
    return {
      data: response.data.data.companies, // Array of companies
      hasMore: response.data.data.hasMore, // Check if there are more companies
      nextPage: pageParam + 1, // Increment the page number for the next query
    };
  };

  // Infinite query hook for pagination
  const {
    data, // Paginated data
    fetchNextPage, // Function to fetch the next page
    hasNextPage, // Boolean to determine if there are more pages to load
    isFetchingNextPage, // Boolean to show if the next page is being fetched
    isLoading, // Boolean for loading state
    error // Error handling
  } = useInfiniteQuery({
    queryKey: ['company', companyID],
    queryFn: fetchCompanyDetails,
    getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined, // Define the next page parameter
    enabled: !!companyID
  });

  // Effect to trigger fetchNextPage when `inView` is true (when the bottom element is in view)
  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage(); // Fetch the next page when the element is in view
    }
  }, [inView, hasNextPage, fetchNextPage]);

  if (isLoading) {
    return <div>Loading1...</div>; // Show loading while fetching
  }

  if (error) {
    return <div>Error loading companies...</div>; // Show error message if any error occurs
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      <div className='flex justify-start w-[80%] text-base mx-auto mt-8'>
        <p>
          If You are the Employee of anyone below mentioned Company, you can use the Company Id associated with their names
          to register on this portal. Your request will go to the admin, who will verify you.
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
                  // Iterate over all the pages and map through their company data
                  data?.pages?.map((page) =>
                    page?.data?.map((company, index) => (
                      <tr key={index} className='text-center'>
                        <td className='py-2 md:px-4 px-2 border-b'>{company.companyName}</td>
                        <td className='py-2 md:px-4 px-2 border-b'>{company._id}</td>
                      </tr>
                    ))
                  )
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Ref for infinite scrolling */}
      {hasNextPage && (
        <div ref={ref} className='flex justify-center mt-8'>
          {isFetchingNextPage ? <div>Loading more companies...</div> : <div>Loading2...</div>}
        </div>
      )}
    </div>
  );
}

export default CompanyID;


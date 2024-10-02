import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useMessageContext } from "@/context/MessageContext";
import Loader from "@/components/Loader";
axios.defaults.withCredentials = true;
function VerifyEmployee() {
  const location = useLocation();
  const unverifiedUser = location.state?.unverifiedUser;
  const [isVerifyingId,setIsVerifyingId]=useState(null);
  const [userList, setUserList] = useState(unverifiedUser?.data || []);
  const { message, messageType,setMessage,setMessageType } = useMessageContext();
  const handleVerifyUser = async (employeeId, companyId) => {
    setIsVerifyingId(employeeId);
    await axios
      .post(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/admin/verifyemployee`, { employeeId, companyId })
      .then((res) => {
        console.log(res.data);
        setMessage("Employee Verified Succesfully");
        setMessageType("success");
        
        // Remove the verified user from the list
        const updatedUserList = userList?userList.filter((user) => user._id !== employeeId):userList;
        setUserList(updatedUserList);
        setIsVerifyingId(null);
      })
      .catch((err) => {
        console.log(err);
        setMessage("Employee not Verified");
        setMessageType("error");
        setIsVerifyingId(null);
      });
  };

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000); // 5 seconds

      return () => clearTimeout(timer); // Cleanup timer on unmount or if message changes
    }
  }, [message, setMessage]);

  return (
    <div className="flex flex-col min-h-screen gap-10">
      <h1 className="text-center font-semibold text-3xl ">Verify Employee</h1>
      {message && (
              <div className={`message ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} p-2  text-white text-center`}>{message}</div>
             )}
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 xs:mx-8 mx-auto sm:gap-4 xl:gap-10 gap-6">
        {userList?.map((user) => (
          <div
            key={user._id}
            className="flex flex-col sm:gap-3 gap-1 bg-blue-100 text-md   rounded-lg justify-around md:p-4 p-3"
          >
            <h3>username: {user.username}</h3>
            <p>email: {user.email}</p>
            <p>role: {user.role}</p>
            <p>companyId: {user.companyId}</p>
            <Button onClick={()=>handleVerifyUser(user?._id,user.companyId) } className="bg-green-500">
                  { isVerifyingId===user._id ? (
                    <div className="flex gap-2">
                      <Loader />
                      <p>Verifying...</p>
                    </div>
                  ) : (
                    "Verify"
                  )}
                </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifyEmployee;

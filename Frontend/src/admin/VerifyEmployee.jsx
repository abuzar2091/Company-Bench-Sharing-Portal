import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
axios.defaults.withCredentials = true;
function VerifyEmployee() {
  const location = useLocation();
  const unverifiedUser = location.state?.unverifiedUser;
  const [verifyUser, setVerifyUser] = useState(null);
  const [userList, setUserList] = useState(unverifiedUser?.data || []);
  const handleVerifyUser = async (employeeId, companyId) => {
    await axios
      .post(`${import.meta.env.VITE_API_URI}/api/v1/admin/verifyemployee`, { employeeId, companyId })
      .then((res) => {
        console.log(res.data);
        setVerifyUser(res.data);
        // Remove the verified user from the list
        const updatedUserList = userList.filter((user) => user._id !== employeeId);
        setUserList(updatedUserList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="flex flex-col min-h-screen gap-20">
      <h1 className="text-center font-semibold text-3xl ">Verify Employee</h1>
      {verifyUser && (
        <p className="bg-green-500 text-white text-center">
          {verifyUser.message}
        </p>
      )}
      <div className="grid grid-cols-3">
        {userList?.map((user) => (
          <div
            key={user._id}
            className="flex flex-col bg-blue-300  h-[200px] sm:ml-4  w-[70%] ml-4 rounded-lg justify-around p-2"
          >
            <h3>{user.username}</h3>
            <p>{user.email}</p>
            <p>{user.role}</p>
            <p>{user.companyId}</p>
            <Button
              onClick={() => handleVerifyUser(user?._id, user?.companyId)}
            >
              Verify
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VerifyEmployee;

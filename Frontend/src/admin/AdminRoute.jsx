import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import AlertMessage from "@/share/AlertMessage";
import { useUserContext } from "@/context/AuthContext.jsx";

const AdminRoute = ({ children }) => {
  const navigate=useNavigate();
  const { isAuthenticated, user } = useUserContext(); // Get the current user from the AuthContext
  console.log("user hai admin ", user, isAuthenticated);
  // if (!isAuthenticated) {
  //   // Redirect to the login page if the user is not logged in
  //   return <Navigate to="/login" />;
  // } 
 // else 
//  if (user.role.length===0) {
//   // Redirect to the login page if the user is not logged in
//   // return <Navigate to="/login" />;
//    return navigate("/login")
// } 
  if (user.role !== "admin") {
    // Show an alert message if the user is not an admin
    return <AlertMessage msg="You are not authorized to perform this action. Either You are not the Admin or not logged In." />;
  }
  
  // Render the children components (admin routes) if the user is an admin
  return children;
};

export default AdminRoute;

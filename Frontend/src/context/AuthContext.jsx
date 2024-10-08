import { useContext, useEffect, useState, createContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const INITIAL_USER = {
  _id: "",
  username: "",
  companyId:"",
  email: "",
  role:"",
};
const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
};
const AuthContext = createContext(INITIAL_STATE);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(INITIAL_USER);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  axios.defaults.withCredentials = true;
  const navigate = useNavigate();
  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const currentAccount= await axios.get(`${import.meta.env.VITE_BACKEND_API_URI}/api/v1/users/get-current-user` ,{
        withCredentials: true, // Ensure cookies are sent with the request
      });  
   
        console.log("inside getcurr context");
        // const currentAccount = await getCurrentUSer();
        console.log(currentAccount?.data?.data);
      if (currentAccount?.data?.data) {
        setUser({
          id: currentAccount?.data?.data?._id,
          username: currentAccount?.data.data.username,
          companyId:currentAccount?.data.data.companyId,
          email: currentAccount?.data.data.email,
          role:currentAccount?.data.data.role,
           });
        setIsAuthenticated(true);
        
        return true;
      }
      return false;
    } catch (error) {
      console.log(
        "something happening wrong during the creating centralized context ",
        error
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  console.log("user ",user);
  useEffect(() => {
    if (
      localStorage.getItem("cookieFallback") === "[]" ||
      localStorage.getItem("cookieFallback") === null
    )
    //  navigate("/sign-in");
    checkAuthUser();
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    setUser,
    checkAuthUser,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
export const useUserContext = () => useContext(AuthContext);

import { INITIAL_USER, useUserContext } from '@/context/AuthContext';
import React, { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Header() {
    const {
        setUser,
        setIsAuthenticated,
        isAuthenticated,
        checkAuthUser,
        isLoading: isUserLoading,
      } = useUserContext();
      const navigate = useNavigate();
    
      const [authStatus, setAuthStatus] = useState(isAuthenticated);
      console.log(isAuthenticated);

      const handleSignOut = async (e) => {
        e.preventDefault();
         setIsAuthenticated(false);
         setUser(INITIAL_USER);
        await axios.post("/api/v1/users/logout"
      ).then((res)=>{
        console.log(res);
      }).catch((err)=>{
        console.log("error ",err);
      });
      };
    let navItems = [
        { name: "Home", redirection: "/", active: true },
        { name: "Sign-In", redirection: "/login", active: !isAuthenticated },
        { name: "Sign-Up", redirection: "/signup", active: !isAuthenticated },
      ];
      //sticky justify-between bg-blue-400 z-100  top-0 
    
  return (
    <div className="flex justify-between border-2">
        <img className='h-16 ml-4' src="/images/logo4.png" alt="logo"/>
        <ul className=" flex mr-4 opacity-0 sm:opacity-100 gap-8 ">
          {navItems.map((item) =>
            item.active ? (
              <li key={item.name}>
                <NavLink
                  to={`${item.redirection}`}
                  className={({ isActive }) =>
                    ` inline-block lg:px-6 md:px-2 py-2 duration-200 hover:bg-blue-100
                                        rounded-full
                                         ${
                                           isActive
                                             ? "text-blue-700 "
                                             : "text-white-700"
                                         }`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ) : null
          )}
          {isAuthenticated ? 
          (
            <div className="flex items-start gap-4">
              <button onClick={handleSignOut} className="px-2 py-[6px]">
                Sign out
              </button>
              <Link to="/my-profile">
              <div className="flex justify-center items-start  gap-2 cursor-pointer">
                <button>
                  <p className="small-medium lg:base-medium py-1">My Account</p>
                </button>
                <img
                  src="/assets/icons/img_profile_24_outline.svg"
                  alt="profiletwentyfo"
                  className="h-[30px] w-[30px] mt-1"
                />
              </div>
              </Link>
            </div>
          ):""}
        </ul>
    </div>
  )
}

export default Header